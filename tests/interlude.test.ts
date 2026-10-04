import { describe, expect, mock, test } from 'claude-code/testing'

import { ACTIONS } from '../hooks/catalog'
import { detectLang, isQuiet, pick, recordActivity, shouldNudge, zoneAt } from '../hooks/select'

const H = { offeredAt: {}, categoryAt: {} }
const at = (h: number, m = 0) => h * 60 + m
const gate = {
  now: 10_000_000, minuteOfDay: at(11), activeMs: 91 * 60_000, maxPerDay: 4, shownToday: 0,
  snoozedUntil: 0, isOffToday: false, lastNudgeAt: null,
}

describe('catalogue', () => {
  test('has all 20 actions with both languages', async () => {
    expect(ACTIONS.length).toBe(20)
    for (const a of ACTIONS) {
      expect(a.title.el.length > 0 && a.title.en.length > 0).toBe(true)
      expect(a.steps.el.length).toBe(a.steps.en.length)
    }
  })
})

describe('time', () => {
  test('zones follow rules.yaml', async () => {
    expect(zoneAt(at(6))).toBe('morning')
    expect(zoneAt(at(12))).toBe('midday')
    expect(zoneAt(at(15))).toBe('afternoon')
    expect(zoneAt(at(19))).toBe('evening')
    expect(zoneAt(at(2))).toBe('evening')
  })
  test('quiet hours wrap past midnight', async () => {
    expect(isQuiet(at(21))).toBe(true)
    expect(isQuiet(at(3))).toBe(true)
    expect(isQuiet(at(8))).toBe(false)
    expect(isQuiet(at(19, 59))).toBe(false)
  })
})

describe('nudge gates', () => {
  test('fires after 90 active minutes', async () => {
    expect(shouldNudge(gate)).toBe(true)
    expect(shouldNudge({ ...gate, activeMs: 89 * 60_000 })).toBe(false)
  })
  test('a limit of 0 means no automatic suggestion', async () => {
    expect(shouldNudge({ ...gate, maxPerDay: 0 })).toBe(false)
  })
  test('respects the daily cap, snooze, "no more today", quiet hours and the 45-minute gap', async () => {
    expect(shouldNudge({ ...gate, shownToday: 4 })).toBe(false)
    expect(shouldNudge({ ...gate, snoozedUntil: gate.now + 1 })).toBe(false)
    expect(shouldNudge({ ...gate, isOffToday: true })).toBe(false)
    expect(shouldNudge({ ...gate, minuteOfDay: at(21) })).toBe(false)
    expect(shouldNudge({ ...gate, lastNudgeAt: gate.now - 30 * 60_000 })).toBe(false)
  })
  test('idle longer than 15 minutes resets active time', async () => {
    const a = recordActivity({ lastActivityAt: 0, activeMs: 80 * 60_000 }, 16 * 60_000)
    expect(a.activeMs).toBe(0)
    const b = recordActivity({ lastActivityAt: 0, activeMs: 80 * 60_000 }, 10 * 60_000)
    expect(b.activeMs).toBe(90 * 60_000)
  })
})

describe('selection', () => {
  test('automatic suggestions never pick manual-only actions', async () => {
    for (let i = 0; i < 50; i++) {
      const a = pick({ actions: ACTIONS, now: 1, minuteOfDay: at(10), signal: 'long_session', history: H, isAutomatic: true })
      expect(a === null || !a.tags.includes('manual-only')).toBe(true)
    }
  })
  test('explicit /breathe may open a manual-only action in its category', async () => {
    const a = pick({ actions: ACTIONS, now: 1, minuteOfDay: at(10), signal: null, history: H, isAutomatic: false, category: 'shutdown', exclude: ['tomorrow-starts-here'] })
    expect(a?.tags.includes('manual-only')).toBe(true)
  })
  test('a plain /breathe never suggests a manual-only action, even in the evening', async () => {
    for (let i = 0; i < 50; i++) {
      const a = pick({ actions: ACTIONS, now: 1, minuteOfDay: at(20, 8), signal: null, history: H, isAutomatic: false })
      expect(a === null || !a.tags.includes('manual-only')).toBe(true)
    }
  })
  test('in the evening a plain /breathe is not stuck on the closing category', async () => {
    const seen = new Set<string>()
    for (let i = 0; i < 60; i++) {
      const a = pick({ actions: ACTIONS, now: 1, minuteOfDay: at(20, 45), signal: null, history: H, isAutomatic: false })
      if (a) seen.add(a.category)
    }
    expect(seen.size).toBeGreaterThan(3)
  })
  test('rotation moves to the least recently offered category', async () => {
    const first = pick({ actions: ACTIONS, now: 10, minuteOfDay: at(10), signal: 'long_session', history: H, isAutomatic: true, random: () => 0 })
    expect(first).not.toBe(null)
    const history = { offeredAt: { [first!.id]: 10 }, categoryAt: { [first!.category]: 10 } }
    const second = pick({ actions: ACTIONS, now: 10, minuteOfDay: at(10), signal: 'long_session', history, isAutomatic: true, random: () => 0 })
    expect(second?.category).not.toBe(first?.category)
  })
  test('cooldown removes a recently offered action from automatic rotation', async () => {
    const history = { offeredAt: Object.fromEntries(ACTIONS.map(a => [a.id, 0])), categoryAt: {} }
    expect(pick({ actions: ACTIONS, now: 30 * 60_000, minuteOfDay: at(10), signal: 'long_session', history, isAutomatic: true })).toBe(null)
  })
})

describe('language', () => {
  test('follows the prose, ignoring code', async () => {
    expect(detectLang('Μπορείς να διορθώσεις αυτό το σφάλμα;')).toBe('el')
    expect(detectLang('Can you fix this failing test please?')).toBe('en')
    expect(detectLang('Δες γιατί αποτυγχάνει αυτό:\n```\nconst value = someFunctionCall(argument)\n```')).toBe('el')
    expect(detectLang('Δες αυτό:\n```\nconst value = someFunctionCall(argument)\n```')).toBe(null) // too little prose: abstain
    expect(detectLang('ok')).toBe(null)
  })
})

// The engine's pane host, as a session answers it: placed and shown.
const panes = (on: Parameters<typeof mock.store>[0]): string[] => {
  const opened: string[] = []
  on('ui.open', ($, e) => {
    opened.push(e.id)
    return { value: { isPlaced: true, id: e.id, title: e.title ?? '', isShown: true, isFocused: false } }
  })
  return opened
}

describe('the /breathe command', () => {
  test('status shows the default limit of 4', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const r = await $.command.run({ command: 'breathe', args: 'status' } as never)
    expect(JSON.stringify(r)).toContain('Limit: 4')
  })
  test('limit 0 turns automatic suggestions off, and /breathe still opens a break', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const opened = panes(on)
    const off = await $.command.run({ command: 'breathe', args: 'limit 0' } as never)
    expect(JSON.stringify(off)).toContain('/breathe')
    const status = await $.command.run({ command: 'breathe', args: 'status' } as never)
    expect(JSON.stringify(status)).toContain('Limit: 0')
    const open = await $.command.run({ command: 'breathe', args: '' } as never)
    expect(JSON.stringify(open)).toContain('·')
    expect(opened).toEqual(['interlude'])
  })
  test('help lists every subcommand, in English after lang en', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const el = JSON.stringify(await $.command.run({ command: 'breathe', args: 'help' } as never))
    for (const w of ['limit', 'lang', 'status', 'preview']) expect(el).toContain(w)
    await $.command.run({ command: 'breathe', args: 'lang en' } as never)
    const en = JSON.stringify(await $.command.run({ command: 'breathe', args: 'help' } as never))
    expect(en).toContain('research-backed breaks')
  })
  test('an unknown word points to help instead of opening a break', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'xyz' } as never))
    expect(r).toContain('/breathe help')
  })
  test('a category opens a break from that category', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    panes(on)
    const r = await $.command.run({ command: 'breathe', args: 'μάτια' } as never)
    const eyes = ACTIONS.filter(a => a.category === 'eyes').flatMap(a => [a.title.el, a.title.en])
    expect(eyes.some(t => JSON.stringify(r).includes(t))).toBe(true)
  })
})
