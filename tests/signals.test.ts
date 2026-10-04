import { describe, expect, mock, test } from 'claude-code/testing'

import { addReading, frictionFrom, isFromPerson, parseLlm, readPrompt, type CueAt } from '../hooks/signals'

const MIN = 60_000

describe('reading prompts', () => {
  test('finds friction in Greek and English, with or without accents', async () => {
    expect(readPrompt('Ακόμα δεν δουλεύει, τι κάνω λάθος;').cues).toContain('unchanged_failure')
    expect(readPrompt('ακομα δεν δουλευει').cues).toContain('unchanged_failure')
    expect(readPrompt('It still fails after the change').cues).toContain('unchanged_failure')
    expect(readPrompt('Έχω κολλήσει εδώ').cues).toContain('stuck_report')
    expect(readPrompt("I'm stuck on this").cues).toContain('stuck_report')
    expect(readPrompt('Με εκνευρίζει αυτό το bug').cues).toContain('frustrated')
    expect(readPrompt('my eyes are tired').cues).toContain('fatigued')
  })
  test('ignores ordinary work talk', async () => {
    for (const t of ['Γιατί χρησιμοποιούμε αυτό το API;', 'Run the test again.', 'Why is this slow?', 'πάλι το ίδιο αρχείο']) {
      expect(readPrompt(t).cues).toEqual([])
    }
  })
  test('ignores code, logs, quotes and examples', async () => {
    expect(readPrompt('Δες:\n```\n// still fails here\n```').cues).toEqual([])
    expect(readPrompt('The log says "still broken"').cues).toEqual([])
    expect(readPrompt('> same error').cues).toEqual([])
    expect(readPrompt('Γράψε ένα παράδειγμα χρήστη που λέει έχω κολλήσει').cues).toEqual([])
  })
  test('recognises success, but not a negated one', async () => {
    expect(readPrompt('Τέλεια, τώρα δουλεύει!').isSuccess).toBe(true)
    expect(readPrompt('That worked, thanks').isSuccess).toBe(true)
    expect(readPrompt('Δεν δούλεψε').isSuccess).toBe(false)
  })
})

describe('whose prompts count', () => {
  test('only the person\'s own prompts', async () => {
    for (const kind of ['composer', 'bridge']) expect(isFromPerson({ kind })).toBe(true)
    for (const kind of ['sdk', 'channel', 'peer', 'peer-send-message', 'task-notification', 'scheduled-trigger', 'projects-relay', 'plugin']) {
      expect(isFromPerson({ kind })).toBe(false)
    }
    expect(isFromPerson({ kind: 'plugin', asUser: true })).toBe(true)
  })
})

describe('turning cues into friction', () => {
  test('one unchanged failure is not enough; two within ten minutes is stuck', async () => {
    let cues: CueAt[] = []
    cues = addReading(cues, readPrompt('still fails'), 0)
    expect(frictionFrom(cues, 0)).toBe(null)
    cues = addReading(cues, readPrompt('same error'), 3 * MIN)
    expect(frictionFrom(cues, 3 * MIN)).toBe('stuck')
  })
  test('failures more than ten minutes apart do not add up', async () => {
    let cues: CueAt[] = []
    cues = addReading(cues, readPrompt('still fails'), 0)
    cues = addReading(cues, readPrompt('same error'), 12 * MIN)
    expect(frictionFrom(cues, 12 * MIN)).toBe(null)
  })
  test('success clears friction', async () => {
    let cues: CueAt[] = []
    cues = addReading(cues, readPrompt('still fails'), 0)
    cues = addReading(cues, readPrompt('that worked'), MIN)
    cues = addReading(cues, readPrompt('same error'), 2 * MIN)
    expect(frictionFrom(cues, 2 * MIN)).toBe(null)
  })
  test('a self-report counts at once, and wins over stuck', async () => {
    let cues: CueAt[] = addReading([], readPrompt('έχω κολλήσει'), 0)
    expect(frictionFrom(cues, 0)).toBe('stuck')
    cues = addReading(cues, readPrompt('κουράστηκαν τα μάτια μου'), MIN)
    expect(frictionFrom(cues, MIN)).toBe('fatigued')
  })
})

describe('the AI answer', () => {
  test('acts only on a confident stuck, frustrated or fatigued', async () => {
    expect(parseLlm('{"state":"stuck","confidence":0.9}')).toBe('stuck')
    expect(parseLlm('Sure: {"state":"fatigued","confidence":0.75}')).toBe('fatigued')
    expect(parseLlm('{"state":"stuck","confidence":0.5}')).toBe(null)
    expect(parseLlm('{"state":"focused","confidence":0.95}')).toBe(null)
    expect(parseLlm('{"state":"unclear","confidence":0.9}')).toBe(null)
    expect(parseLlm('not json')).toBe(null)
  })
})

describe('commands', () => {
  test('signals and the AI check are off until the person turns them on, and AI needs consent', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const run = (args: string) => $.command.run({ command: 'breathe', args } as never).then(r => JSON.stringify(r))
    await run('lang el')
    expect(await run('status')).toContain('ανενεργό')
    expect(await run('ai on')).toContain('/breathe ai agree')
    expect(await run('status')).toContain('pending')
    expect(await run('ai agree')).toContain('ενεργοποιήθηκε')
    const status = await run('status')
    expect(status).toContain('Τριβή: ενεργό')
    expect(status).toContain('έλεγχος AI: on')
    expect(await run('ai off')).toContain('απενεργοποιήθηκε')
  })
  test('agree without asking first does nothing', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'ai agree' } as never))
    expect(r).toContain('/breathe ai on')
  })
  test('the enterprise profile locks the AI check', { options: { profile: 'enterprise' } }, async ($, on) => {
    mock.store(on, { settings: { ai: 'on', signals: true } })
    mock.clock(on, { now: Date.UTC(2026, 9, 5, 8) })
    const r = JSON.stringify(await $.command.run({ command: 'breathe', args: 'ai on' } as never))
    expect(r).toContain('enterprise')
    const status = JSON.stringify(await $.command.run({ command: 'breathe', args: 'status' } as never))
    expect(status).toContain('locked')
  })
})
