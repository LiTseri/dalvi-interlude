import { describe, expect, mock, test } from 'claude-code/testing'

import { ACTIONS } from '../hooks/catalog'
import { readPrompt } from '../hooks/signals'

const at10 = new Date(2026, 9, 5, 10, 0).getTime()
const at1958 = new Date(2026, 9, 5, 19, 58).getTime()

const BAND = { plugin: 'dalvi-interlude', surface: 'terminal', component: 'AbovePrompt' } as const
const BAND_PROPS = { hasSurvey: false, isWorking: false, maxRows: 20, bodyColumns: 100 } as never
const PANE = { plugin: 'dalvi-interlude', component: 'Pane', requestId: 'interlude' } as const
const PANE_PROPS = { title: 'x', isFocused: true, bodyColumns: 80, placement: 'dock', scroll: undefined, view: undefined } as never

/** Beneath the plugin: prompts, turns, panes and toasts, recorded. */
const engine = (on: any) => {
  const toasts: string[] = []
  on('ui.render', { component: 'AbovePrompt' }, () => ({ type: 'Box', props: {}, children: [] }) as never)
  on('prompt.submit', ($: any, e: any) => ({ text: e.text }) as never)
  on('turn.complete', () => ({ text: 'ok', reason: 'answer' }) as never)
  on('ui.open', ($: any, e: any) => ({ value: { isPlaced: true, id: e.id, title: e.title ?? '', isShown: true, isFocused: false } }))
  on('ui.close', () => ({ value: undefined }))
  on('ui.toast', ($: any, e: any) => { toasts.push(e.text); return { value: undefined } })
  return toasts
}

/** A store in memory the test can read back. */
const memStore = (on: any, init: Record<string, unknown> = {}) => {
  const m = new Map<string, unknown>(Object.entries(init))
  on('store.get', ($: any, e: any) => ({ value: m.get(e.key) }))
  on('store.set', ($: any, e: any) => { m.set(e.key, JSON.parse(JSON.stringify(e.value))); return { value: undefined } })
  on('store.delete', ($: any, e: any) => { m.delete(e.key); return { value: undefined } })
  on('store.keys', () => ({ value: [...m.keys()] }))
  return m
}

const say = ($: any, text: string) => $.prompt.submit({ text, asUser: true })
const endTurn = ($: any) => $.turn.complete({ answer: 'ok', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer', text: 'ok' } as never)
const band = async ($: any) => $.ui.mount({ ...BAND, props: BAND_PROPS })
const hasCard = async ($: any): Promise<boolean> => JSON.stringify(await (await band($)).drawn()).includes('"key":"go"')
/** Two failures within ten minutes: a "stuck" card, when signals are on. */
const getStuck = async ($: any, clock: any) => {
  await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
}

describe('the suggestion card', () => {
  test('"Later" snoozes it, and nothing more comes until the snooze ends', async ($, on) => {
    const store = memStore(on, { settings: { signals: true } })
    const clock = mock.clock(on, { now: at10 })
    const toasts = engine(on)
    await getStuck($, clock)
    const ui = await band($)
    await ui.press({ key: 'later' })
    await (await band($)).press({ key: 'snooze-15' })
    expect(await hasCard($)).toBe(false)
    expect(toasts.length).toBe(1)
    const day = store.get('day') as { snoozedUntil: number }
    expect(day.snoozedUntil).toBe(clock.now() + 15 * 60_000)
  })

  test('"No more today" clears the card and stops automatic cards for the day', async ($, on) => {
    const store = memStore(on, { settings: { signals: true } })
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    await getStuck($, clock)
    await (await band($)).press({ key: 'no-more' })
    expect(await hasCard($)).toBe(false)
    expect((store.get('day') as { isOffToday: boolean }).isOffToday).toBe(true)
    await clock.advance(60 * 60_000)
    await getStuck($, clock)
    expect(await hasCard($)).toBe(false)
  })

  test('a preview is not counted toward the daily limit', async ($, on) => {
    const store = memStore(on)
    mock.clock(on, { now: at10 })
    engine(on)
    await $.command.run({ command: 'breathe', args: 'preview' } as never)
    expect(await hasCard($)).toBe(true)
    await (await band($)).press({ key: 'other' })
    const day = store.get('day') as { shown: number } | undefined
    expect(day?.shown ?? 0).toBe(0)
    expect(store.get('history')).toBe(undefined)
  })

  test('a waiting card steps aside when quiet hours begin', async ($, on) => {
    mock.store(on, { settings: { signals: true } })
    const clock = mock.clock(on, { now: at1958 })
    engine(on)
    await getStuck($, clock)
    expect(await hasCard($)).toBe(true)
    await clock.advance(5 * 60_000) // now 20:04, quiet hours
    await say($, 'next step'); await endTurn($)
    expect(await hasCard($)).toBe(false)
  })
})

describe('the break timer', () => {
  test('counts down to the end and says the break is done', async ($, on) => {
    mock.store(on)
    const clock = mock.clock(on, { now: at10 })
    const toasts = engine(on)
    await $.command.run({ command: 'breathe', args: 'water' } as never)
    const pane = await $.ui.mount({ ...PANE, surface: 'terminal', props: PANE_PROPS })
    await pane.press({ key: 'toggle' })
    await clock.advance(10 * 60_000)
    expect(JSON.stringify(await pane.drawn())).toContain('0:00')
    expect(toasts.length).toBe(1)
  })

  test('stops when the pane is closed, with no "done" later', async ($, on) => {
    mock.store(on)
    const clock = mock.clock(on, { now: at10 })
    const toasts = engine(on)
    await $.command.run({ command: 'breathe', args: 'water' } as never)
    const pane = await $.ui.mount({ ...PANE, surface: 'terminal', props: PANE_PROPS })
    await pane.press({ key: 'toggle' })
    await pane.press({ key: 'close' })
    await clock.advance(10 * 60_000)
    expect(toasts.length).toBe(0)
  })
})

describe('reading prompts, v1.0.1', () => {
  test('a negated cue is not friction', async () => {
    expect(readPrompt("I don't need a break, just fix it").cues).toEqual([])
    expect(readPrompt('Δεν χρειάζομαι διάλειμμα').cues).toEqual([])
    expect(readPrompt('No, still fails').cues).toContain('unchanged_failure')
    // A negation in the previous sentence does not reach the next one.
    expect(readPrompt("It doesn't. Still failing.").cues).toContain('unchanged_failure')
    expect(readPrompt('Nope, it does not. Same error.').cues).toContain('unchanged_failure')
    expect(readPrompt('Όχι. Ακόμα δεν δουλεύει').cues).toContain('unchanged_failure')
  })
})

describe('settings, v1.0.1', () => {
  test('the enterprise lock ignores case and spaces', { options: { profile: ' Enterprise ' } }, async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: at10 })
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'ai on' } as never))
    expect(r).toContain('enterprise')
  })

  test('an empty LC_ALL falls back to LANG for the language', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: at10 })
    mock.env(on, { LC_ALL: '', LANG: 'el_GR.UTF-8' })
    on('command.register', () => ({ value: undefined }) as never)
    await $.session.start({ source: 'startup' } as never).catch(() => undefined)
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'status' } as never))
    expect(r).toContain('Όριο')
  })
})

describe('deleting your data', () => {
  test('/breathe reset deletes every stored key', async ($, on) => {
    const store = memStore(on, { settings: { signals: true, maxPerDay: 2, lang: 'el' } })
    const clock = mock.clock(on, { now: at10 })
    mock.env(on, { LANG: 'en_US.UTF-8' })
    engine(on)
    await getStuck($, clock)
    expect(store.size > 0).toBe(true)
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'reset' } as never))
    expect(store.size).toBe(0)
    expect(r).toContain('back to the defaults') // the language went back to the device locale too
    expect(await hasCard($)).toBe(false)
  })
})

describe('the AI check, v1.0.1', () => {
  test('no model call when no break could be shown anyway', async ($, on) => {
    const now = at10
    const offeredAt = Object.fromEntries(ACTIONS.map(a => [a.id, now]))
    memStore(on, { settings: { signals: true, ai: 'on' }, history: { offeredAt, categoryAt: {} } })
    const clock = mock.clock(on, { now })
    engine(on)
    const sent: string[] = []
    on('model.complete', ($: any, e: any) => { sent.push(e.prompt); return { value: { isAnswered: true, text: '{"state":"stuck","confidence":0.9}', usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } } as never })
    await getStuck($, clock)
    expect(sent.length).toBe(0)
    expect(await hasCard($)).toBe(false)
  })
})
