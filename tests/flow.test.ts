import { describe, expect, mock, test } from 'claude-code/testing'

const at10 = new Date(2026, 9, 5, 10, 0).getTime()

// Beneath the plugin, the engine accepts prompts and finishes turns.
const engine = (on: Parameters<typeof mock.store>[0], answer?: string | 'reject') => {
  const sent: string[] = []
  on('ui.render', { component: 'AbovePrompt' }, () => ({ type: 'Box', props: {}, children: [] }) as never)
  on('prompt.submit', ($, e) => ({ text: e.text }) as never)
  on('turn.complete', ($, e) => ({ text: 'ok', reason: 'answer' }) as never)
  on('model.complete', ($, e) => {
    sent.push(e.prompt)
    if (answer === 'reject') return { deny: 'model not allowed' } as never
    return { value: answer === undefined
      ? { isAnswered: false, reason: 'api-error', status: 500, error: 'x', usage: { input_tokens: 0, output_tokens: 0, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } as never
      : { isAnswered: true, text: answer, usage: { input_tokens: 1, output_tokens: 1, cache_creation_input_tokens: 0, cache_read_input_tokens: 0 } } as never }
  })
  return sent
}
const say = ($: any, text: string) => $.prompt.submit({ text, asUser: true })

// The card's first line is the message for its reason (spec/ui-copy.yaml; English with no detected language).
const MESSAGE = {
  stuck: 'Let this one rest for a moment?',
  frustrated: 'A breather before the next try?',
  fatigued: 'A little time away from the screen?',
  long_session: 'Been working a while; ready for a little pause?',
}
const BAND = { plugin: 'dalvi-interlude', surface: 'terminal', component: 'AbovePrompt' } as const
const BAND_PROPS = { hasSurvey: false, isWorking: false, maxRows: 20, bodyColumns: 100 } as never
/** The reason the card shows, or null when there is no card. */
const cardReason = async ($: any, _on?: any): Promise<string | null> => {
  const ui = await $.ui.mount({ ...BAND, props: BAND_PROPS })
  const drawn = JSON.stringify(await ui.drawn())
  for (const [k, v] of Object.entries(MESSAGE)) if (drawn.includes(v)) return k
  return null
}

/** A store in memory the test can read back, answering the plugin's $.store. */
const memStore = (on: any, init: Record<string, unknown> = {}) => {
  const m = new Map<string, unknown>(Object.entries(init))
  on('store.get', ($: any, e: any) => ({ value: m.get(e.key) }))
  on('store.set', ($: any, e: any) => { m.set(e.key, JSON.parse(JSON.stringify(e.value))); return { value: undefined } })
  on('store.delete', ($: any, e: any) => { m.delete(e.key); return { value: undefined } })
  on('store.keys', () => ({ value: [...m.keys()] }))
  return m
}
const endTurn = ($: any) => $.turn.complete({ answer: 'ok', durationMs: 1000, isAborted: false, turnId: 't1', reason: 'answer', text: 'ok' } as never)

describe('friction flow', () => {
  test('with signals off, friction never shows a card', async ($, on) => {
    mock.store(on)
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($, on)).toBe(null)
  })
  test('with signals on, two failures bring a "stuck" card; no model call without AI consent', async ($, on) => {
    mock.store(on, { settings: { signals: true } })
    const clock = mock.clock(on, { now: at10 })
    const sent = engine(on)
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($, on)).toBe('stuck')
    expect(sent.length).toBe(0)
  })
  test('with AI on, the model decides: "focused" means no card', async ($, on) => {
    mock.store(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    const sent = engine(on, '{"state":"focused","confidence":0.9}')
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(sent.length).toBe(1)
    expect(sent[0]).toContain('same error')
    expect(await cardReason($, on)).toBe(null)
  })
  test('with AI on, a confident "frustrated" shows a frustrated card', async ($, on) => {
    mock.store(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    engine(on, '{"state":"frustrated","confidence":0.85}')
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($, on)).toBe('frustrated')
  })
  test('if the model is unreachable, the local signal still works', async ($, on) => {
    mock.store(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($, on)).toBe('stuck')
  })
  test('enterprise never calls the model, even if AI was stored on', { options: { profile: 'enterprise' } }, async ($, on) => {
    mock.store(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    const sent = engine(on, '{"state":"focused","confidence":0.9}')
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(sent.length).toBe(0)
    expect(await cardReason($, on)).toBe('stuck')
  })
  test('a limit of 0 means no friction card either', async ($, on) => {
    mock.store(on, { settings: { signals: true, maxPerDay: 0 } })
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($, on)).toBe(null)
  })
  test('nothing about prompts is written to the store', async ($, on) => {
    const store = memStore(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    engine(on, '{"state":"stuck","confidence":0.9}')
    await say($, 'my secret project still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    const all = JSON.stringify([...store.entries()])
    expect(all).toContain('history') // the store was written to…
    expect(all).not.toContain('secret') // …but never with prompt text
    expect(all).not.toContain('same error')
  })
  test('if the model call is refused, the local signal still works and nothing throws', async ($, on) => {
    mock.store(on, { settings: { signals: true, ai: 'on' } })
    const clock = mock.clock(on, { now: at10 })
    engine(on, 'reject')
    await say($, 'still fails'); await clock.advance(60_000); await say($, 'same error'); await endTurn($)
    expect(await cardReason($)).toBe('stuck')
  })
  test('a long turn counts as active time, so 90 minutes of agentic work brings a card', async ($, on) => {
    mock.store(on)
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    for (let i = 0; i < 4; i++) {
      await say($, 'continue with the refactor')
      await clock.advance(25 * 60_000) // Claude works 25 minutes
      await endTurn($)
      await clock.advance(60_000)
    }
    expect(await cardReason($)).toBe('long_session')
  })
})

describe('idle time', () => {
  test('coming back after 3 hours with a slash command does not count the break as work', async ($, on) => {
    mock.store(on)
    const clock = mock.clock(on, { now: at10 })
    engine(on)
    await say($, 'start the refactor'); await clock.advance(5 * 60_000); await endTurn($)
    await clock.advance(3 * 60 * 60_000) // away for 3 hours
    await say($, '/review'); await clock.advance(2 * 60_000); await endTurn($)
    expect(await cardReason($)).toBe(null)
  })
})

describe('consent', () => {
  test('with no language detected yet, the AI consent is shown in English and Greek', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: at10 })
    mock.env(on, { LANG: 'en_US.UTF-8' })
    await $.session.start({ source: 'startup' } as never).catch(() => undefined)
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'ai on' } as never))
    expect(r).toContain('If you turn this on')
    expect(r).toContain('Αν το ενεργοποιήσεις')
    expect(r).toContain('/breathe ai agree')
  })
})
