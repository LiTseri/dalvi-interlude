// Friction signals from the person's own prose, mirroring spec/signals.yaml.
// Pure functions: no `$`, no storage. Callers keep only cue kinds and timestamps.

export type Cue = 'stuck_report' | 'unchanged_failure' | 'frustrated' | 'fatigued'
export type Friction = 'stuck' | 'frustrated' | 'fatigued'
export type CueAt = { cue: Cue; at: number }

const WINDOW_MS = 10 * 60_000

/**
 * Prompts the person typed: in the terminal, or from their own remote client.
 * Never headless/SDK runs, channel relays, peer sessions, task notifications,
 * scheduled triggers, or other plugins (unless a plugin submits as the person).
 * An unstamped prompt (no origin) is treated as the person's own.
 */
export const isFromPerson = (origin: { kind: string; asUser?: boolean } | undefined): boolean =>
  origin === undefined || origin.kind === 'composer' || origin.kind === 'bridge' ||
  (origin.kind === 'plugin' && origin.asUser === true)

/** Lowercase, strip Greek accents, unify apostrophes, punctuation to spaces. */
export const normalize = (text: string): string =>
  ` ${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘`´]/g, "'")
    .replace(/[^\p{L}\p{N}'\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `

const norm = (list: string[]): string[] => list.map(p => normalize(p).trim())

// signals.yaml → heuristics. Short cue phrases, matched on word boundaries.
const PATTERNS: Record<Cue, string[]> = {
  frustrated: norm([
    'με εκνευρίζει', 'έχω εκνευριστεί', 'δεν αντέχω άλλο', 'με έχει τρελάνει', 'έχω τρελαθεί',
    'so frustrating', "i'm frustrated", 'i am frustrated', "can't stand this", 'driving me crazy',
  ]),
  unchanged_failure: norm([
    'ακόμα δεν δουλεύει', 'πάλι δεν δουλεύει', 'ακόμα δεν δούλεψε', 'ίδιο σφάλμα', 'ίδιο λάθος', 'δεν άλλαξε τίποτα',
    'still not working', "still doesn't work", 'still does not work', 'still fails', 'still failing',
    'still broken', 'same error', 'nothing changed',
  ]),
  stuck_report: norm([
    'έχω κολλήσει', 'κόλλησα', 'δεν ξέρω τι άλλο να', 'τίποτα δεν δούλεψε', 'καμία λύση δεν',
    "i'm stuck", 'i am stuck', "don't know what else to", 'do not know what else to', 'nothing worked',
    'none of the fixes',
  ]),
  fatigued: norm([
    'κουράστηκαν τα μάτια μου', 'δεν μπορώ να συγκεντρωθώ', 'χρειάζομαι διάλειμμα', 'έχω κουραστεί',
    'είμαι κουρασμένη', 'είμαι κουρασμένος',
    'my eyes are tired', 'my eyes feel tired', "can't focus", 'cannot focus', 'need a break', "i'm tired",
    'i am tired', "i'm exhausted",
  ]),
}

// Explicit progress clears friction ("τώρα δουλεύει", "fixed now").
const SUCCESS = norm([
  'τώρα δουλεύει', 'δουλεύει τώρα', 'λύθηκε', 'διορθώθηκε', 'δούλεψε', 'τέλεια',
  'works now', 'it works', 'fixed now', 'that worked', 'that fixed it', 'solved', 'perfect',
])
const NEGATION_BEFORE = norm(['δεν', 'όχι', 'μη', 'μην', 'not', "didn't", "doesn't", 'never', 'no'])

// Text that is about language rather than the person's own state: examples, quotes, drafts.
const META = norm(['παράδειγμα', 'example', 'e g', 'για παράδειγμα', 'γράψε ένα μήνυμα', 'write a message', 'quote'])

/**
 * The person's own prose: code fences, inline code, quoted lines, quoted strings
 * and log-looking lines removed.
 */
export const ownProse = (text: string): string =>
  text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .split('\n')
    .filter(line => !/^\s*>/.test(line))
    .filter(line => !/^\s*(\[?\d{2,4}[-/:]\d{2}|(error|warn|info|debug|trace|at )\b|\s{4,})/i.test(line))
    .join('\n')
    .replace(/"[^"\n]*"|«[^»\n]*»|“[^”\n]*”|'[^'\n]{6,}'/g, ' ')

const has = (t: string, p: string): boolean => t.includes(` ${p} `)

/** Whether `p` occurs in `t` without a negation word just before it. */
const hasUnnegated = (t: string, p: string): boolean => {
  let from = 0
  for (;;) {
    const i = t.indexOf(` ${p} `, from)
    if (i === -1) return false
    const before = t.slice(Math.max(0, i - 12), i).trim().split(' ').pop() ?? ''
    if (!NEGATION_BEFORE.includes(before)) return true
    from = i + 1
  }
}

export type Reading = { cues: Cue[]; isSuccess: boolean }

/** Reads one prompt: which friction cues it holds, and whether it reports success. */
export const readPrompt = (text: string): Reading => {
  const t = normalize(ownProse(text))
  if (META.some(m => t.includes(` ${m} `))) return { cues: [], isSuccess: false }
  const cues = (Object.keys(PATTERNS) as Cue[]).filter(cue => PATTERNS[cue].some(p => has(t, p)))
  const isSuccess = cues.length === 0 && SUCCESS.some(p => hasUnnegated(t, p))
  return { cues, isSuccess }
}

/**
 * Turns recent cues into at most one friction state. Self-reports win; a stuck
 * state from unchanged failures needs two separate prompts within ten minutes.
 */
export const frictionFrom = (cues: CueAt[], now: number): Friction | null => {
  const recent = cues.filter(c => now - c.at <= WINDOW_MS)
  if (recent.some(c => c.cue === 'fatigued')) return 'fatigued'
  if (recent.some(c => c.cue === 'frustrated')) return 'frustrated'
  if (recent.some(c => c.cue === 'stuck_report')) return 'stuck'
  if (recent.filter(c => c.cue === 'unchanged_failure').length >= 2) return 'stuck'
  return null
}

/** Adds one prompt's reading to the cue list (each prompt counts once per cue), pruning old ones. */
export const addReading = (cues: CueAt[], reading: Reading, now: number): CueAt[] => {
  if (reading.isSuccess) return []
  return [...cues.filter(c => now - c.at <= WINDOW_MS), ...reading.cues.map(cue => ({ cue, at: now }))]
}

// Phase 2 (signals.yaml → llm).
export const LLM_SYSTEM = [
  'You read a few short messages a person sent to their coding assistant.',
  'Decide whether their WORK seems to be going smoothly or has hit friction.',
  'Do not diagnose emotions or health. Judge only what the messages say about the work.',
  'Ignore quoted text, code, logs and examples; only the person\'s own words count.',
  'Answer with JSON only: {"state": "focused" | "stuck" | "frustrated" | "fatigued" | "unclear", "confidence": 0.0-1.0}',
].join('\n')

export const llmPrompt = (prompts: string[]): string =>
  `Messages, oldest first:\n${prompts.map((p, i) => `${i + 1}. ${ownProse(p).slice(0, 600)}`).join('\n')}`

export const ACT_IF_CONFIDENCE_GTE = 0.7

/** Parses the model's answer; anything unclear or unparseable is no nudge. */
export const parseLlm = (text: string): Friction | null => {
  const m = text.match(/\{[\s\S]*\}/)
  if (!m) return null
  try {
    const v = JSON.parse(m[0]) as { state?: unknown; confidence?: unknown }
    const conf = typeof v.confidence === 'number' ? v.confidence : 0
    if (conf < ACT_IF_CONFIDENCE_GTE) return null
    return v.state === 'stuck' || v.state === 'frustrated' || v.state === 'fatigued' ? v.state : null
  } catch {
    return null
  }
}
