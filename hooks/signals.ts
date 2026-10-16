// Friction signals from the person's own prose. The rules are described in spec/signals.yaml.
// Pure functions: no `$`, no storage. Callers keep only cue kinds and timestamps.
import { CUE_PHRASES, SUCCESS_PHRASES } from './signals-data'

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

/**
 * Lowercase, strip Greek accents, unify apostrophes; clause punctuation becomes a `|` token
 * (so a negation in the previous sentence never reaches the next phrase), other punctuation spaces.
 */
export const normalize = (text: string): string =>
  ` ${text
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[’‘`´]/g, "'")
    .replace(/[.,;:!?…·\u037E\u0387]/g, ' | ')
    .replace(/[^\p{L}\p{N}'|\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()} `

const norm = (list: string[]): string[] => list.map(p => normalize(p).trim())

// Cue and success phrases come from spec/signals.yaml (hooks/signals-data.ts), matched on whole words.
const PATTERNS: Record<Cue, string[]> = {
  frustrated: norm([...CUE_PHRASES.frustrated]),
  unchanged_failure: norm([...CUE_PHRASES.unchanged_failure]),
  stuck_report: norm([...CUE_PHRASES.stuck_report]),
  fatigued: norm([...CUE_PHRASES.fatigued]),
}

// Explicit progress clears friction ("τώρα δουλεύει", "fixed now").
const SUCCESS = norm([...SUCCESS_PHRASES])
const NEGATION_BEFORE = norm(['δεν', 'όχι', 'μη', 'μην', 'not', "didn't", "doesn't", 'never', 'no'])
// For friction cues only words that negate the phrase itself: "no, still fails" is still friction.
const CUE_NEGATION = norm(['δεν', 'μη', 'μην', 'not', "don't", "didn't", "doesn't", 'never'])

// Text that is about language rather than the person's own state: examples, quotes, drafts.
const META = norm(['παράδειγμα', 'example', 'e.g.', 'για παράδειγμα', 'γράψε ένα μήνυμα', 'write a message', 'quote'])

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

/** Whether `p` occurs in `t` without one of the `negations` just before it. */
const hasUnnegated = (t: string, p: string, negations: string[] = NEGATION_BEFORE): boolean => {
  let from = 0
  for (;;) {
    const i = t.indexOf(` ${p} `, from)
    if (i === -1) return false
    const before = t.slice(Math.max(0, i - 12), i).trim().split(' ').pop() ?? ''
    if (!negations.includes(before)) return true
    from = i + 1
  }
}

export type Reading = { cues: Cue[]; isSuccess: boolean }

/** Reads one prompt: which friction cues it holds, and whether it reports success. */
export const readPrompt = (text: string): Reading => {
  const t = normalize(ownProse(text))
  if (META.some(m => t.includes(` ${m} `))) return { cues: [], isSuccess: false }
  // "I don't need a break" or «δεν χρειάζομαι διάλειμμα» is not a cue.
  const cues = (Object.keys(PATTERNS) as Cue[]).filter(cue => PATTERNS[cue].some(p => hasUnnegated(t, p, CUE_NEGATION)))
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

// The optional AI check (signals.yaml → llm).
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
