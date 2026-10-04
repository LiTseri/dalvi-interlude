// Pure selection and scheduling logic, mirroring spec/rules.yaml.
// No `$` here, so every rule is unit-testable.
import type { Action, Category, Lang, Signal, Zone } from '../types'
import { UI_COPY } from './copy'

export const RULES = {
  idleResetMin: 15,
  intervalMin: 90,
  defaultMaxPerDay: 4,
  maxPerDayRange: [0, 10] as const,
  minGapBetweenNudgesMin: 45,
  snoozeOptionsMin: [15, 30, 60] as const,
  quietHours: { from: '20:00', to: '08:00' },
}

/** signals.yaml → mapping: signal → preferred categories, in order. */
export const SIGNAL_CATEGORIES: Record<Signal, Category[]> = {
  stuck: ['movement', 'mind'],
  frustrated: ['breathing', 'mind'],
  fatigued: ['eyes', 'movement', 'hydration'],
  long_session: ['movement', 'eyes', 'mind', 'hydration'],
}

/** rules.yaml → time_rules prefer_categories, per zone. */
const ZONE_PREFERS: Record<Zone, Category[]> = {
  morning: ['movement', 'eyes'],
  midday: ['movement'],
  afternoon: ['eyes', 'mind'],
  evening: ['shutdown'],
}

const LEVEL_RANK = { A: 0, B: 1, C: 2 } as const

const minutesOf = (hhmm: string): number => {
  const [hours = 0, mins = 0] = hhmm.split(':').map(Number)
  return hours * 60 + mins
}

export const zoneAt = (minuteOfDay: number): Zone => {
  if (minuteOfDay >= 6 * 60 && minuteOfDay < 12 * 60) return 'morning'
  if (minuteOfDay >= 12 * 60 && minuteOfDay < 15 * 60) return 'midday'
  if (minuteOfDay >= 15 * 60 && minuteOfDay < 19 * 60) return 'afternoon'
  return 'evening'
}

/** Quiet hours may wrap past midnight (20:00 → 08:00). */
export const isQuiet = (minuteOfDay: number, from = RULES.quietHours.from, to = RULES.quietHours.to): boolean => {
  const f = minutesOf(from)
  const t = minutesOf(to)
  return f <= t ? minuteOfDay >= f && minuteOfDay < t : minuteOfDay >= f || minuteOfDay < t
}

export type History = {
  /** action id → epoch ms it was last offered automatically */
  offeredAt: Record<string, number>
  /** category → epoch ms it was last offered */
  categoryAt: Partial<Record<Category, number>>
}

export type PickInput = {
  actions: Action[]
  now: number
  minuteOfDay: number
  signal: Signal | null
  history: History
  /** true for a suggestion the person did not ask for */
  isAutomatic: boolean
  /** ids to skip (e.g. the one "Άλλη ιδέα" is replacing) */
  exclude?: string[]
  /** restrict to one category (the /breathe menu) */
  category?: Category
  random?: () => number
}

/**
 * selection.order: filter_time_of_day → apply_time_rules → filter_cooldown →
 * prefer_signal_match → rotate → prefer_higher_evidence. Returns null when no
 * action passes every gate (automatic suggestions never force one).
 */
export const pick = (input: PickInput): Action | null => {
  const { actions, now, minuteOfDay, signal, history, isAutomatic } = input
  const random = input.random ?? Math.random
  const zone = zoneAt(minuteOfDay)
  const afterTwo = minuteOfDay >= 14 * 60

  let pool = actions.filter(a => !(input.exclude ?? []).includes(a.id))
  if (input.category) pool = pool.filter(a => a.category === input.category)

  // A suggestion (automatic, or a plain /breathe) must fit: no manual-only, right time of day.
  // Only an explicit category choice opens the special ones.
  if (isAutomatic || !input.category) {
    // selection.exclude_tags_for_automatic
    pool = pool.filter(a => !a.tags.includes('manual-only'))
    // filter_time_of_day
    pool = pool.filter(a => a.times.includes('any') || a.times.includes(zone))
  }
  if (isAutomatic) {
    // filter_cooldown (automatic rotation only)
    pool = pool.filter(a => {
      const at = history.offeredAt[a.id]
      return at === undefined || now - at >= a.cooldownMin * 60_000
    })
  }
  // A bedtime-only break is offered only in the evening, even when asked for by category.
  if (zone !== 'evening') pool = pool.filter(a => !a.tags.includes('bedtime-only'))
  // apply_time_rules: exclusions hold for every suggestion
  if (afterTwo || zone === 'evening') pool = pool.filter(a => !a.tags.includes('caffeine'))
  if (pool.length === 0) return null

  const signalCats = signal ? SIGNAL_CATEGORIES[signal] : []
  const zoneCats = ZONE_PREFERS[zone]
  // Signal fit is a yes/no gate on rank, not an ordering of its categories:
  // otherwise the first mapped category always wins and rotation never runs.
  const score = (a: Action): number[] => {
    const isSignalCategory = signal === null || signalCats.includes(a.category)
    const isSignalFit = signal === null || a.signals.includes(signal)
    return [
      isSignalCategory ? 0 : 1, //                            prefer_signal_match (category)
      isSignalFit ? 0 : 1, //                                 …and the action's own fit
      // time preference (soft): automatic suggestions only. When the person opens
      // /breathe or asks for "another idea", it would pin every pick to one category.
      isAutomatic && !zoneCats.includes(a.category) ? 1 : 0,
      history.categoryAt[a.category] ?? 0, //                 rotate: least recently offered first
      LEVEL_RANK[a.level], //                                 prefer_higher_evidence
    ]
  }
  // A break the person asks for: any fitting action, at random, for variety.
  // Ranking by signal, time, rotation and evidence is for automatic suggestions.
  if (!isAutomatic) return pool[Math.floor(random() * pool.length)] ?? null

  const ranked = pool
    .map(a => ({ a, s: score(a), r: random() }))
    .sort((x, y) => {
      for (let i = 0; i < x.s.length; i++) {
        const d = (x.s[i] ?? 0) - (y.s[i] ?? 0)
        if (d !== 0) return d
      }
      return x.r - y.r // random tie-break only among equals
    })
  return ranked[0]?.a ?? null
}

export type Activity = { lastActivityAt: number | null; activeMs: number }

/** Active time: gaps longer than idle_reset_min reset the counter. */
export const recordActivity = (act: Activity, now: number, isTurnEnd = false): Activity => {
  if (act.lastActivityAt === null) return { lastActivityAt: now, activeMs: 0 }
  const gap = Math.max(0, now - act.lastActivityAt)
  // A turn the person started is active time however long Claude works;
  // only the pause between the end of a turn and the next prompt can be idle.
  if (!isTurnEnd && gap > RULES.idleResetMin * 60_000) return { lastActivityAt: now, activeMs: 0 }
  return { lastActivityAt: now, activeMs: act.activeMs + gap }
}

export type NudgeGate = {
  now: number
  minuteOfDay: number
  activeMs: number
  maxPerDay: number
  shownToday: number
  snoozedUntil: number
  isOffToday: boolean
  lastNudgeAt: number | null
}

/** Every gate any automatic suggestion must pass (cap, snooze, off-today, quiet hours, spacing). */
export const canNudge = (g: NudgeGate): boolean =>
  g.maxPerDay > 0 &&
  !g.isOffToday &&
  g.shownToday < g.maxPerDay &&
  g.now >= g.snoozedUntil &&
  !isQuiet(g.minuteOfDay) &&
  (g.lastNudgeAt === null || g.now - g.lastNudgeAt >= RULES.minGapBetweenNudgesMin * 60_000)

/** A time-based suggestion: every gate, plus 90 minutes of active time. */
export const shouldNudge = (g: NudgeGate): boolean => canNudge(g) && g.activeMs >= RULES.intervalMin * 60_000

/** UI language from the person's own prose: Greek letters outweighing Latin. */
export const detectLang = (text: string): Lang | null => {
  const prose = text.replace(/```[\s\S]*?```/g, ' ').replace(/`[^`]*`/g, ' ')
  const greek = (prose.match(/[Ͱ-Ͽἀ-῿]/g) ?? []).length
  const latin = (prose.match(/[a-zA-Z]/g) ?? []).length
  if (greek + latin < 12) return null
  return greek >= latin ? 'el' : 'en'
}

// Evidence labels come from spec/ui-copy.yaml (hooks/copy.ts).
export const LEVEL_LABEL: Record<Lang, Record<Action['level'], string>> = {
  el: { A: UI_COPY.evidence_labels.A.el, B: UI_COPY.evidence_labels.B.el, C: UI_COPY.evidence_labels.C.el },
  en: { A: UI_COPY.evidence_labels.A.en, B: UI_COPY.evidence_labels.B.en, C: UI_COPY.evidence_labels.C.en },
}
