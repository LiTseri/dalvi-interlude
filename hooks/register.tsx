// Dalvì Interlude — small, research-backed breaks inside Claude Code. Command: /breathe
// v1.0: /breathe, time-based suggestions, opt-in friction signals, opt-in AI check (Phase 2).
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Action, Card, Category, Lang, PaneView, Signal } from '../types'
import { ACTIONS } from './catalog'
import { UI_COPY } from './copy'
import {
  LEVEL_LABEL,
  RULES,
  canNudge,
  detectLang,
  isQuiet,
  pick,
  recordActivity,
  shouldNudge,
  type Activity,
  type History,
} from './select'
import {
  LLM_SYSTEM,
  addReading,
  frictionFrom,
  isFromPerson,
  llmPrompt,
  parseLlm,
  readPrompt,
  type CueAt,
  type Friction,
} from './signals'

const PANE = 'interlude'
const card = atom({ plugin: 'dalvi-interlude', key: 'card' } as const, null)
const pane = atom({ plugin: 'dalvi-interlude', key: 'pane' } as const, null)
const lang = atom({ plugin: 'dalvi-interlude', key: 'lang' } as const, 'en')

type AiState = 'off' | 'pending' | 'on'
type Settings = { maxPerDay: number; lang: 'auto' | Lang; signals: boolean; ai: AiState }
type Day = { date: string; shown: number; isOffToday: boolean; snoozedUntil: number; lastNudgeAt: number | null }

const CATEGORIES: Category[] = ['breathing', 'movement', 'hydration', 'eyes', 'mind', 'shutdown']
const CATEGORY_LABEL: Record<Lang, Record<Category, string>> = {
  el: { breathing: 'Αναπνοή', movement: 'Κίνηση', hydration: 'Νερό', eyes: 'Μάτια', mind: 'Νους', shutdown: 'Κλείσιμο' },
  en: { breathing: 'Breathing', movement: 'Movement', hydration: 'Water', eyes: 'Eyes', mind: 'Mind', shutdown: 'Closing' },
}
const CATEGORY_ALIASES: Record<string, Category> = {
  breathing: 'breathing', αναπνοή: 'breathing', αναπνοη: 'breathing',
  movement: 'movement', κίνηση: 'movement', κινηση: 'movement',
  hydration: 'hydration', water: 'hydration', νερό: 'hydration', νερο: 'hydration',
  eyes: 'eyes', μάτια: 'eyes', ματια: 'eyes',
  mind: 'mind', νους: 'mind',
  shutdown: 'shutdown', closing: 'shutdown', κλείσιμο: 'shutdown', κλεισιμο: 'shutdown',
}

// signals.yaml → messages
// Card messages, buttons and moments come from spec/ui-copy.yaml (hooks/copy.ts).
const MESSAGE: Record<Lang, Record<string, string>> = {
  el: Object.fromEntries(Object.entries(UI_COPY.card_messages).map(([k, v]) => [k, v.el])),
  en: Object.fromEntries(Object.entries(UI_COPY.card_messages).map(([k, v]) => [k, v.en])),
}

const uiText = (l: Lang) => {
  const b = UI_COPY.buttons
  const m = UI_COPY.moments
  return {
    go: b.go[l], stop: b.stop[l], other: b.other[l], later: b.later[l], noMore: b.no_more[l],
    basis: b.basis[l], close: b.close[l],
    done: m.done[l], stopped: m.stopped[l], offToday: m.off_today[l],
    snoozed: (min: number) => m.snoozed[l].replace('{minutes}', String(min)),
    chooseSnooze: m.choose_snooze[l], pick: m.pick[l], none: m.none[l],
  }
}

const T = {
  el: {
    ...uiText('el'),
    hideBasis: 'Απόκρυψη', min: 'λεπτά', caution: 'Πριν ξεκινήσεις', source: 'Πηγή',
    paneTitle: 'Dalvì Interlude · /breathe',
    keysHint: '1–6: κατηγορία · Tab: μετακίνηση · Enter: επιλογή',
  },
  en: {
    ...uiText('en'),
    hideBasis: 'Hide', min: 'min', caution: 'Before you start', source: 'Source',
    paneTitle: 'Dalvì Interlude · /breathe',
    keysHint: '1–6: category · Tab: move · Enter: select',
  },
}

type HelpInfo = { limit: number; lang: string; signals: boolean; ai: string; isEnterprise: boolean }
const pad = (v: string, n: number): string => (v.length >= n ? v : v + ' '.repeat(n - v.length))

type StatusInfo = { limit: number; shown: number; isOffToday: boolean; activeMin: number; intervalMin: number; lang: string; snoozedMin: number; signals: boolean; ai: string }

// Replies to /breathe subcommands, in the person's language.
const MSG = {
  el: {
    help: (h: HelpInfo) => [
      'Dalvì Interlude · μικρά διαλείμματα 1–5 λεπτών, με επιστημονική βάση',
      '',
      'ΕΝΤΟΛΕΣ',
      '  /breathe                  ένα διάλειμμα που ταιριάζει στην ώρα',
      '  /breathe <κατηγορία>      αναπνοή · κίνηση · νερό · μάτια · νους · κλείσιμο',
      '  /breathe status           οι ρυθμίσεις σου και ο ενεργός χρόνος',
      '  /breathe preview          δες τώρα πώς φαίνεται η αυτόματη κάρτα',
      '  /breathe help             αυτός ο οδηγός',
      '',
      'ΡΥΘΜΙΣΕΙΣ                    τώρα          προεπιλογή',
      `  /breathe limit 0–10       ${pad(h.limit + '/ημέρα', 13)} 4/ημέρα (0 = καμία αυτόματη)`,
      `  /breathe lang el|en|auto  ${pad(h.lang, 13)} auto (ακολουθεί τη γλώσσα που γράφεις)`,
      `  /breathe signals on|off   ${pad(h.signals ? 'on' : 'off', 13)} off`,
      `  /breathe ai on|off        ${pad(h.ai, 13)} off (θέλει τη συναίνεσή σου)`,
      '',
      'ΤΙ ΓΙΝΕΤΑΙ ΜΟΝΟ ΤΟΥ',
      '  Μετά από 90 λεπτά ενεργής δουλειάς, μια κάρτα πάνω από το prompt προτείνει διάλειμμα.',
      '  Ποτέ όσο το Claude δουλεύει, ποτέ 20:00–08:00, το πολύ μία ανά 45 λεπτά.',
      '  Μια παύση πάνω από 15 λεπτά μηδενίζει τον μετρητή.',
      '',
      'ΑΝΙΧΝΕΥΣΗ ΤΡΙΒΗΣ (signals)',
      '  Αν η δουλειά κολλήσει, προτείνει διάλειμμα νωρίτερα. Το καταλαβαίνει από φράσεις όπως',
      '  «ακόμα δεν δουλεύει» δύο φορές σε 10 λεπτά, ή «έχω κολλήσει», «κουράστηκαν τα μάτια μου».',
      '  Διαβάζει μόνο ό,τι γράφεις εσύ, τοπικά. Αγνοεί κώδικα και παραθέσεις. Δεν αποθηκεύει κείμενο.',
      '',
      'ΕΛΕΓΧΟΣ ΜΕ AI (ai)',
      '  Προαιρετικός. Πριν από μια κάρτα τριβής, έως 5 πρόσφατα μηνύματα πάνε στο Claude Haiku για',
      '  επιβεβαίωση, μέσα από τη σύνδεση του Claude Code. Δεν αποθηκεύεται τίποτα.',
      `  ${h.isEnterprise ? 'Σε αυτό το περιβάλλον είναι κλειδωμένος (profile: enterprise).' : 'Γράψε /breathe ai on για να δεις τι ακριβώς κάνει πριν συμφωνήσεις.'}`,
      '',
      'ΣΤΟ PANEL   1–6 κατηγορία · Tab μετακίνηση · Enter επιλογή · «Η έρευνα» δείχνει τη μελέτη',
      '',
      'Ιδιωτικότητα: τα μηνύματά σου δεν αποθηκεύονται ποτέ. Λεπτομέρειες στο PRIVACY.md.',
      'Δεν είναι ιατρική συμβουλή. Αν κάτι σε ενοχλεί, σταμάτα.',
    ].join('\n'),
    limitUsage: (n: number) => `Χρήση: /breathe limit 0–10 (τώρα: ${n})`,
    limitOff: 'Οι αυτόματες προτάσεις απενεργοποιήθηκαν. Το /breathe δουλεύει πάντα.',
    limitSet: (n: number) => `Έως ${n} αυτόματες προτάσεις την ημέρα.`,
    langUsage: 'Χρήση: /breathe lang el | en | auto',
    langSet: (v: string) => (v === 'auto' ? 'Γλώσσα: αυτόματα, ακολουθεί τη γλώσσα που γράφεις.' : v === 'el' ? 'Γλώσσα: Ελληνικά.' : 'Γλώσσα: English.'),
    status: (i: StatusInfo) => [
      `Όριο: ${i.limit} την ημέρα · εμφανίστηκαν σήμερα: ${i.shown}${i.isOffToday ? ' · κλειστό για σήμερα' : ''}`,
      `Ενεργός χρόνος: ${i.activeMin}′ από ${i.intervalMin}′ · γλώσσα: ${i.lang}`,
      `Τριβή: ${i.signals ? 'ενεργό' : 'ανενεργό'} · έλεγχος AI: ${i.ai}`,
      i.snoozedMin > 0 ? `Σε αναβολή για ${i.snoozedMin}′` : '',
    ].filter(Boolean).join('\n'),
    preview: 'Προεπισκόπηση της κάρτας αυτόματης πρότασης (δεν μετράει στο όριο).',
    signalsUsage: 'Χρήση: /breathe signals on | off',
    signalsOn: 'Προτάσεις όταν η δουλειά κολλάει: ενεργές. Διαβάζω τοπικά μόνο τα μηνύματα που γράφεις εσύ, χωρίς να αποθηκεύω κείμενο.',
    signalsOff: 'Προτάσεις όταν η δουλειά κολλάει: ανενεργές.',
    aiUsage: 'Χρήση: /breathe ai on | off',
    aiConsent: (text: string) => `${text}\n\nΓια να συμφωνήσεις, γράψε: /breathe ai agree`,
    aiOn: 'Ο έλεγχος με AI ενεργοποιήθηκε, μαζί με τις τοπικές ενδείξεις τριβής. Το απενεργοποιείς όποτε θέλεις με /breathe ai off.',
    aiOff: 'Ο έλεγχος με AI απενεργοποιήθηκε. Τα πρόσφατα μηνύματα σβήστηκαν από τη μνήμη.',
    aiLocked: 'Ο έλεγχος με AI είναι κλειδωμένος σε αυτό το περιβάλλον (profile: enterprise).',
    aiNoPending: 'Γράψε πρώτα /breathe ai on για να δεις τι σημαίνει.',
    unknown: (w: string) => `Δεν αναγνωρίζω το «${w}». Γράψε /breathe help για τις επιλογές.`,
  },
  en: {
    help: (h: HelpInfo) => [
      'Dalvì Interlude · small, research-backed breaks of 1–5 minutes',
      '',
      'COMMANDS',
      '  /breathe                  a break that fits the time of day',
      '  /breathe <category>       breathing · movement · water · eyes · mind · closing',
      '  /breathe status           your settings and active time',
      '  /breathe preview          see what the automatic card looks like, now',
      '  /breathe help             this guide',
      '',
      'SETTINGS                     now           default',
      `  /breathe limit 0–10       ${pad(h.limit + '/day', 13)} 4/day (0 = no automatic cards)`,
      `  /breathe lang el|en|auto  ${pad(h.lang, 13)} auto (follows the language you write in)`,
      `  /breathe signals on|off   ${pad(h.signals ? 'on' : 'off', 13)} off`,
      `  /breathe ai on|off        ${pad(h.ai, 13)} off (asks for your consent)`,
      '',
      'WHAT HAPPENS ON ITS OWN',
      '  After 90 minutes of active work, a card above the prompt suggests a break.',
      '  Never while Claude is working, never 20:00–08:00, at most one every 45 minutes.',
      '  A pause of more than 15 minutes resets the count.',
      '',
      'FRICTION SIGNALS (signals)',
      '  When work gets stuck, a break is suggested sooner. It notices phrases such as',
      '  "still fails" twice in 10 minutes, or "I\'m stuck", "my eyes are tired".',
      '  It reads only what you type, on your machine. It skips code and quotes. No text is stored.',
      '',
      'AI CHECK (ai)',
      '  Optional. Before a friction card, up to 5 recent messages go to Claude Haiku to confirm,',
      '  through Claude Code\'s own connection. Nothing is stored.',
      `  ${h.isEnterprise ? 'Locked in this environment (profile: enterprise).' : 'Type /breathe ai on to see exactly what it does before you agree.'}`,
      '',
      'IN THE PANEL   1–6 category · Tab move · Enter select · "The research" shows the study',
      '',
      'Privacy: your messages are never stored. Details in PRIVACY.md.',
      'Not medical advice. Stop if anything feels uncomfortable.',
    ].join('\n'),
    limitUsage: (n: number) => `Usage: /breathe limit 0–10 (now: ${n})`,
    limitOff: 'Automatic suggestions are off. /breathe always works.',
    limitSet: (n: number) => `Up to ${n} automatic suggestions a day.`,
    langUsage: 'Usage: /breathe lang el | en | auto',
    langSet: (v: string) => (v === 'auto' ? 'Language: automatic, follows the language you write in.' : v === 'el' ? 'Language: Ελληνικά.' : 'Language: English.'),
    status: (i: StatusInfo) => [
      `Limit: ${i.limit} a day · shown today: ${i.shown}${i.isOffToday ? ' · off for today' : ''}`,
      `Active time: ${i.activeMin}′ of ${i.intervalMin}′ · language: ${i.lang}`,
      `Friction signals: ${i.signals ? 'on' : 'off'} · AI check: ${i.ai}`,
      i.snoozedMin > 0 ? `Snoozed for ${i.snoozedMin}′` : '',
    ].filter(Boolean).join('\n'),
    preview: 'Preview of the automatic suggestion card (not counted).',
    signalsUsage: 'Usage: /breathe signals on | off',
    signalsOn: 'Suggestions when work gets stuck: on. I read only what you write, locally, and store no text.',
    signalsOff: 'Suggestions when work gets stuck: off.',
    aiUsage: 'Usage: /breathe ai on | off',
    aiConsent: (text: string) => `${text}\n\nTo agree, type: /breathe ai agree`,
    aiOn: 'The AI check is on, together with local friction signals. Turn it off anytime with /breathe ai off.',
    aiOff: 'The AI check is off. Recent messages were cleared from memory.',
    aiLocked: 'The AI check is locked in this environment (profile: enterprise).',
    aiNoPending: 'Type /breathe ai on first to see what it means.',
    unknown: (w: string) => `I don't recognise "${w}". Type /breathe help for the options.`,
  },
}

const byId = (id: string): Action | undefined => ACTIONS.find(a => a.id === id)
const minuteOfDay = (now: number): number => {
  const d = new Date(now)
  return d.getHours() * 60 + d.getMinutes()
}
const dateKey = (now: number): string => {
  const d = new Date(now)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}
const mmss = (sec: number): string => `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`

// Module memory, cleared on restart, idle reset or opt-out. Never written to disk.
let activity: Activity = { lastActivityAt: null, activeMs: 0 }
let timer: { cancel: () => void } | null = null
// Friction cue kinds and timestamps only (no text).
let cues: CueAt[] = []
// Up to 5 recent prompts, kept ONLY while the AI check is on, for that check alone.
let recentPrompts: string[] = []
// The profile from the manifest's userConfig: 'enterprise' locks the AI check off.
let isEnterprise = false
// Why the waiting card was shown. Kept here, not in shared host state, so no other plugin can read it.
let cardReason: Signal = 'long_session'
// Whether the current turn was started by the person (not a relay, schedule or another plugin).
let isPersonTurn = false


const aiAllowed = (s: Settings): boolean => !isEnterprise && s.ai === 'on'

const AI_CONSENT = {
  el: consentText('el'),
  en: consentText('en'),
}
function consentText(l: Lang): string {
  return l === 'el'
    ? 'Αν το ενεργοποιήσεις: όταν φαίνεται ότι η δουλειά κόλλησε, έως 5 πρόσφατα μηνύματά σου (χωρίς τα μπλοκ κώδικα, έως 600 χαρακτήρες το καθένα) στέλνονται στο Claude Haiku, μέσα από την ίδια σύνδεση και τα ίδια διαπιστευτήρια που ήδη χρησιμοποιεί το Claude Code, για να κρίνει αν ταιριάζει ένα διάλειμμα. Μετράει στη δική σου χρήση. Ο πάροχος (η Anthropic ή ο cloud πάροχος του οργανισμού σου) το επεξεργάζεται όπως κάθε άλλο μήνυμά σου, με τους δικούς του όρους. Το εργαλείο δεν αποθηκεύει ούτε τα μηνύματα ούτε το αποτέλεσμα. Ενεργοποιούνται επίσης οι τοπικές ενδείξεις τριβής (/breathe signals).'
    : 'If you turn this on: when work seems stuck, up to 5 of your recent messages (fenced code removed, up to 600 characters each) are sent to Claude Haiku, through the same connection and credentials Claude Code already uses, to judge whether a break fits. It counts toward your own usage. The provider (Anthropic, or your organisation\'s cloud provider) processes it like any other message of yours, under its own terms. This tool stores neither the messages nor the result. Local friction signals (/breathe signals) are turned on too.'
}

async function loadSettings($: EngineInterface): Promise<Settings> {
  const s = ((await $.store.get('settings')) ?? {}) as Partial<Settings>
  return {
    maxPerDay: s.maxPerDay ?? RULES.defaultMaxPerDay,
    lang: s.lang ?? 'auto',
    signals: s.signals ?? false,
    ai: isEnterprise ? 'off' : (s.ai ?? 'off'),
  }
}

async function loadDay($: EngineInterface, now: number): Promise<Day> {
  const d = (await $.store.get('day')) as Day | undefined
  return d && d.date === dateKey(now)
    ? d
    : { date: dateKey(now), shown: 0, isOffToday: false, snoozedUntil: d?.snoozedUntil ?? 0, lastNudgeAt: d?.lastNudgeAt ?? null }
}

async function loadHistory($: EngineInterface): Promise<History> {
  return ((await $.store.get('history')) as History | undefined) ?? { offeredAt: {}, categoryAt: {} }
}

async function noteOffered($: EngineInterface, a: Action, now: number): Promise<void> {
  const h = await loadHistory($)
  await $.store.set('history', {
    offeredAt: { ...h.offeredAt, [a.id]: now },
    categoryAt: { ...h.categoryAt, [a.category]: now },
  })
}

function stopTimer(): void {
  timer?.cancel()
  timer = null
}

async function openPane($: EngineInterface, actionId: string): Promise<void> {
  stopTimer()
  const a = byId(actionId)
  await update($, pane, () => ({ actionId, isRunning: false, remainingSec: a?.durationSec ?? 180, isBasisShown: false }))
  await $.ui.open({ id: PANE, title: T[await read($, lang)].paneTitle })
}

async function closePane($: EngineInterface): Promise<void> {
  stopTimer()
  await update($, pane, () => null)
  await $.ui.close({ id: PANE })
}

async function tick($: EngineInterface): Promise<void> {
  const view = await read($, pane)
  if (!view?.isRunning) return stopTimer()
  if (view.remainingSec <= 1) {
    stopTimer()
    await update($, pane, v => (v ? { ...v, isRunning: false, remainingSec: 0 } : v))
    $.ui.toast(T[await read($, lang)].done)
    return
  }
  await update($, pane, v => (v ? { ...v, remainingSec: v.remainingSec - 1 } : v))
}

function startTimer($: EngineInterface): void {
  stopTimer()
  timer = $.clock.every(1000, () => void tick($))
}

async function pickNow($: EngineInterface, opts: { isAutomatic: boolean; category?: Category; exclude?: string[]; actions?: Action[] }): Promise<Action | null> {
  const now = await $.clock.now()
  return pick({
    actions: opts.actions ?? ACTIONS, now, minuteOfDay: minuteOfDay(now), signal: null,
    history: await loadHistory($), isAutomatic: opts.isAutomatic, category: opts.category, exclude: opts.exclude,
  })
}

/** "Άλλη ιδέα": a different category first, then anything else that passes. */
async function anotherFor($: EngineInterface, current: string, isAutomatic: boolean): Promise<Action | null> {
  const cur = byId(current)
  const other = await pickNow($, { isAutomatic, exclude: [current], actions: ACTIONS.filter(a => a.category !== cur?.category) })
  return other ?? (await pickNow($, { isAutomatic, exclude: [current] }))
}

async function clearCard($: EngineInterface): Promise<void> {
  await update($, card, () => null)
}

async function snooze($: EngineInterface, m: number, L: Lang): Promise<void> {
  const now = await $.clock.now()
  const day = await loadDay($, now)
  await $.store.set('day', { ...day, snoozedUntil: now + m * 60_000 })
  await clearCard($)
  $.ui.toast(T[L].snoozed(m))
}

async function offToday($: EngineInterface, L: Lang): Promise<void> {
  const now = await $.clock.now()
  await $.store.set('day', { ...(await loadDay($, now)), isOffToday: true })
  await clearCard($)
  $.ui.toast(T[L].offToday)
}

async function swapCard($: EngineInterface, current: string, isPreview: boolean): Promise<void> {
  const b = await anotherFor($, current, true)
  if (!b) return clearCard($)
  if (!isPreview) await noteOffered($, b, await $.clock.now()) // a preview records nothing
  await update($, card, (cur): Card => (cur ? { ...cur, actionId: b.id } : cur))
}

async function startFromCard($: EngineInterface, actionId: string): Promise<void> {
  await clearCard($)
  await openPane($, actionId)
}

async function chooseSnooze($: EngineInterface): Promise<void> {
  await update($, card, (cur): Card => (cur ? { ...cur, isChoosingSnooze: true } : cur))
}

async function openCategory($: EngineInterface, cat: Category, currentId: string | undefined): Promise<void> {
  const b = (await pickNow($, { isAutomatic: false, category: cat, exclude: currentId ? [currentId] : [] }))
    ?? (await pickNow($, { isAutomatic: false, category: cat }))
  if (b) await openPane($, b.id)
}

async function toggleRun($: EngineInterface, a: Action, isRunning: boolean, L: Lang): Promise<void> {
  if (isRunning) {
    stopTimer()
    await update($, pane, v => (v ? { ...v, isRunning: false } : v))
    $.ui.toast(T[L].stopped)
    return
  }
  await update($, pane, v => (v ? { ...v, isRunning: true, remainingSec: v.remainingSec > 0 ? v.remainingSec : a.durationSec } : v))
  startTimer($)
}

async function openAnother($: EngineInterface, current: string): Promise<void> {
  const b = await anotherFor($, current, false)
  if (b) await openPane($, b.id)
}

async function toggleBasis($: EngineInterface): Promise<void> {
  await update($, pane, v => (v ? { ...v, isBasisShown: !v.isBasisShown } : v))
}

/** The friction this turn suggests, if any, after the AI check when it is on. */
async function frictionNow($: EngineInterface, s: Settings, now: number): Promise<Friction | null> {
  const heuristic = frictionFrom(cues, now)
  if (heuristic === null) return null
  cues = [] // each run of friction is offered once
  if (!aiAllowed(s) || recentPrompts.length === 0) return heuristic
  try {
    const r = await $.model.complete({ model: 'haiku', system: LLM_SYSTEM, prompt: llmPrompt(recentPrompts), maxTokens: 60, effort: 'low', timeoutMs: 8000 })
    // The result is used here and dropped: never stored.
    return r.isAnswered ? parseLlm(r.text) : heuristic
  } catch {
    return heuristic // e.g. the model is not allowed in this organisation: the local signal stands
  }
}

export const register: Register = (on, options) => {
  isEnterprise = options.profile === 'enterprise'

  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'breathe',
      description: 'Dalvì Interlude: a short, research-backed break',
      argumentHint: '[category | help | status | limit 0–10 | lang el|en|auto | signals on|off | ai on|off]',
    })
    const s = await loadSettings($)
    if (s.lang !== 'auto') await update($, lang, () => s.lang)
    else {
      // Until the person's own words show a language: the device locale, else English.
      const locale = ((await $.env.get('LC_ALL')) ?? (await $.env.get('LANG')) ?? '').toLowerCase()
      await update($, lang, (): Lang => (locale.startsWith('el') ? 'el' : 'en'))
    }
    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    // Only the person's own prompts count: not headless runs, relays, peers, schedules or other plugins.
    const isPerson = isFromPerson(e.origin as { kind: string; asUser?: boolean } | undefined)
    // A prompt that starts a turn decides whose turn it is; one delivered into a running turn does not.
    if (e.turnId === undefined) isPersonTurn = isPerson
    if (!isPerson) return next(e)
    const now = await $.clock.now()
    activity = recordActivity(activity, now) // slash commands count as activity too (idle resets apply)
    if (activity.activeMs === 0) {
      cues = [] // idle reset clears friction too
      recentPrompts = []
    }
    if (e.text.trimStart().startsWith('/')) return next(e) // commands are never read for signals or language
    const s = await loadSettings($)
    if (s.signals) {
      cues = addReading(cues, readPrompt(e.text), now)
      if (aiAllowed(s)) recentPrompts = [...recentPrompts, e.text].slice(-5)
    }
    if (s.lang === 'auto') {
      const detected = detectLang(e.text) // used in memory only, never stored
      if (detected) await update($, lang, () => detected)
    }
    return next(e)
  })

  // A finished turn is the safe boundary: nothing runs, so a suggestion may wait above the prompt.
  on('turn.complete', async ($, e, next) => {
    const result = await next(e)
    if (!isPersonTurn) return result // nobody is at the prompt for relayed or scheduled turns
    const now = await $.clock.now()
    activity = recordActivity(activity, now, true)
    const s = await loadSettings($)
    const day = await loadDay($, now)
    const waiting = await read($, card)
    if (waiting !== null) {
      // An unstarted suggestion is cancelled once quiet hours, "no more today" or a limit of 0 apply.
      const isStale = !waiting.isPreview && (s.maxPerDay === 0 || day.isOffToday || isQuiet(minuteOfDay(now)))
      if (!isStale) return result
      await clearCard($)
    }
    const gate = {
      now, minuteOfDay: minuteOfDay(now), activeMs: activity.activeMs,
      maxPerDay: s.maxPerDay, shownToday: day.shown, snoozedUntil: day.snoozedUntil,
      isOffToday: day.isOffToday, lastNudgeAt: day.lastNudgeAt,
    }
    if (!canNudge(gate)) return result
    // Priority: friction the person reported or the work shows, then a long stretch of work.
    const friction = s.signals ? await frictionNow($, s, now) : null
    const reason = friction ?? (shouldNudge(gate) ? 'long_session' : null)
    if (reason === null) return result
    const a = pick({ actions: ACTIONS, now, minuteOfDay: minuteOfDay(now), signal: reason, history: await loadHistory($), isAutomatic: true })
    if (!a) return result // fallback never forces an excluded action
    await noteOffered($, a, now)
    await $.store.set('day', { ...day, shown: day.shown + 1, lastNudgeAt: now })
    activity = { lastActivityAt: now, activeMs: 0 }
    cardReason = reason
    await update($, card, (): Card => ({ actionId: a.id, isChoosingSnooze: false, isPreview: false }))
    return result
  })

  on('command.run', { command: 'breathe' }, async ($, e) => {
    const args = e.args.trim().toLowerCase()
    const s = await loadSettings($)
    const now = await $.clock.now()
    const [word = '', value = ''] = args.split(/\s+/)

    const L = await read($, lang)
    const M = MSG[L]

    if (word === 'help' || word === 'βοήθεια' || word === 'βοηθεια' || word === '?') {
      return { text: M.help({ limit: s.maxPerDay, lang: s.lang, signals: s.signals, ai: isEnterprise ? 'locked' : s.ai, isEnterprise }) }
    }
    if (word === 'limit' || word === 'όριο' || word === 'οριο') {
      const n = Math.round(Number(value))
      if (value === '' || !Number.isFinite(n) || n < RULES.maxPerDayRange[0] || n > RULES.maxPerDayRange[1]) {
        return { text: M.limitUsage(s.maxPerDay) }
      }
      await $.store.set('settings', { ...s, maxPerDay: n })
      if (n === 0) await clearCard($) // a waiting suggestion goes too
      return { text: n === 0 ? M.limitOff : M.limitSet(n) }
    }
    if (word === 'lang' || word === 'γλώσσα' || word === 'γλωσσα') {
      if (value !== 'el' && value !== 'en' && value !== 'auto') return { text: M.langUsage }
      await $.store.set('settings', { ...s, lang: value })
      if (value !== 'auto') await update($, lang, () => value)
      return { text: MSG[value === 'auto' ? L : value].langSet(value) }
    }
    if (word === 'status' || word === 'κατάσταση' || word === 'κατασταση') {
      const day = await loadDay($, now)
      return {
        text: M.status({
          limit: s.maxPerDay, shown: day.shown, isOffToday: day.isOffToday,
          activeMin: Math.round(activity.activeMs / 60_000), intervalMin: RULES.intervalMin, lang: s.lang,
          signals: s.signals, ai: isEnterprise ? 'locked' : s.ai,
          snoozedMin: day.snoozedUntil > now ? Math.ceil((day.snoozedUntil - now) / 60_000) : 0,
        }),
      }
    }
    if (word === 'signals' || word === 'τριβή' || word === 'τριβη') {
      if (value !== 'on' && value !== 'off') return { text: M.signalsUsage }
      const isOn = value === 'on'
      await $.store.set('settings', { ...s, signals: isOn, ai: isOn ? s.ai : 'off' })
      if (!isOn) { cues = []; recentPrompts = [] }
      return { text: isOn ? M.signalsOn : s.ai === 'on' ? `${M.signalsOff} ${M.aiOff}` : M.signalsOff }
    }
    if (word === 'ai') {
      if (isEnterprise) return { text: M.aiLocked }
      if (value === 'on') {
        await $.store.set('settings', { ...s, ai: s.ai === 'on' ? 'on' : 'pending' })
        // Consent is shown in both languages, so it is understood whatever the detected language.
        return { text: s.ai === 'on' ? M.aiOn : M.aiConsent(`${AI_CONSENT[L]}\n\n${AI_CONSENT[L === 'el' ? 'en' : 'el']}`) }
      }
      if (value === 'agree' || value === 'συμφωνώ' || value === 'συμφωνω') {
        if (s.ai !== 'pending') return { text: M.aiNoPending }
        await $.store.set('settings', { ...s, ai: 'on', signals: true })
        return { text: M.aiOn }
      }
      if (value === 'off') {
        await $.store.set('settings', { ...s, ai: 'off' })
        recentPrompts = []
        return { text: M.aiOff }
      }
      return { text: M.aiUsage }
    }
    if (word === 'preview') {
      // Shows the automatic card now, for review; counts nothing and records nothing.
      const a = await pickNow($, { isAutomatic: true })
      if (!a) return { text: T[L].none }
      cardReason = 'long_session'
      await update($, card, (): Card => ({ actionId: a.id, isChoosingSnooze: false, isPreview: true }))
      return { text: M.preview }
    }
    if (word !== '' && CATEGORY_ALIASES[word] === undefined) {
      return { text: M.unknown(word) }
    }

    // /breathe [category]: explicit choice — ignores caps, quiet hours, snooze and cooldown
    const category = CATEGORY_ALIASES[word]
    const a = await pickNow($, { isAutomatic: false, category })
    if (!a) return { text: T[await read($, lang)].none }
    await openPane($, a.id)
    return { text: `${a.title[await read($, lang)]} · ${Math.round(a.durationSec / 60)}′` }
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const c = await read($, card)
    if (c === null || e.props.hasSurvey || e.props.isWorking) return next(e)
    if (!c.isPreview) {
      // A waiting suggestion steps aside once quiet hours, "no more today" or a limit of 0 apply.
      const now = await $.clock.now()
      const [s, day] = [await loadSettings($), await loadDay($, now)]
      if (s.maxPerDay === 0 || day.isOffToday || isQuiet(minuteOfDay(now))) return next(e)
    }
    const a = byId(c.actionId)
    if (!a) return next(e)
    const L = await read($, lang)
    const t = T[L]
    const { Box, Text, Button } = $.ui.resolve(e)

    if (c.isChoosingSnooze) {
      return (
        <Box flexDirection="row" gap={1} borderStyle="round" borderColor="green" paddingX={1}>
          <Text>{t.chooseSnooze}</Text>
          {RULES.snoozeOptionsMin.map(m => (
            <Button
              key={`snooze-${m}`}
              label={`${m}′`}
              onPress={() => snooze($, m, L)}
            />
          ))}
        </Box>
      )
    }

    return (
      <Box flexDirection="column" borderStyle="round" borderColor="green" paddingX={1}>
        <Text dimColor>{MESSAGE[L][cardReason]}</Text>
        <Text bold>
          {a.title[L]} · {Math.round(a.durationSec / 60)} {t.min}
        </Text>
        <Text>{a.steps[L][0] ?? ''}</Text>
        <Box flexDirection="row" gap={1}>
          <Button key="go" label={t.go} variant="primary" onPress={() => startFromCard($, a.id)} />
          <Button
            key="other"
            label={t.other}
            onPress={() => swapCard($, a.id, c.isPreview)}
          />
          <Button key="later" label={t.later} onPress={() => chooseSnooze($)} />
          <Button
            key="no-more"
            label={t.noMore}
            role="dismiss"
            onPress={() => offToday($, L)}
          />
        </Box>
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const view: PaneView | null = await read($, pane)
    const L = await read($, lang)
    const t = T[L]
    const a = view ? byId(view.actionId) : undefined

    // Digits 1–6 pick a category at once; ● marks the current one.
    const categoryRow = (
      <Box flexDirection="column">
        <Box flexDirection="row" flexWrap="wrap" gap={2}>
          {CATEGORIES.map((cat, i) => (
            <Button
              key={`cat-${cat}`}
              label={a?.category === cat ? `● ${CATEGORY_LABEL[L][cat]}` : CATEGORY_LABEL[L][cat]}
              hotkey={String(i + 1)}
              plain
              dimColor={a?.category !== cat}
              onPress={() => openCategory($, cat, a?.id)}
            />
          ))}
        </Box>
        <Text dimColor>{t.keysHint}</Text>
      </Box>
    )

    if (!view || !a) {
      return (
        <Box flexDirection="column" gap={1}>
          <Text>{t.pick}</Text>
          {categoryRow}
        </Box>
      )
    }

    const hasCaution = a.cautions[L] !== '-'
    return (
      <Box flexDirection="column" gap={1}>
        {categoryRow}
        <Box flexDirection="column">
          <Text bold>{a.title[L]}</Text>
          <Text dimColor>
            {Math.round(a.durationSec / 60)} {t.min} · {LEVEL_LABEL[L][a.level]}
          </Text>
        </Box>
        {hasCaution && !view.isRunning && (
          <Text color="yellow">
            {t.caution}: {a.cautions[L]}
          </Text>
        )}
        <Box flexDirection="column">
          {a.steps[L].map((step, i) => (
            <Text key={`step-${i}`}>
              {i + 1}. {step}
            </Text>
          ))}
        </Box>
        <Text bold color={view.isRunning ? 'green' : undefined}>
          {mmss(view.remainingSec)}
        </Text>
        <Box flexDirection="row" flexWrap="wrap" gap={1}>
          <Button
            key="toggle"
            variant="primary"
            label={view.isRunning ? t.stop : t.go}
            onPress={() => toggleRun($, a, view.isRunning, L)}
          />
          <Button
            key="other"
            label={t.other}
            onPress={() => openAnother($, a.id)}
          />
          <Button
            key="basis"
            label={view.isBasisShown ? t.hideBasis : t.basis}
            onPress={() => toggleBasis($)}
          />
          <Button key="close" label={t.close} role="dismiss" onPress={() => closePane($)} />
        </Box>
        {view.isBasisShown && (
          <Box flexDirection="column">
            <Text>{a.claim[L]}</Text>
            <Text dimColor>
              {t.source}: {a.source.citation} · https://doi.org/{a.source.doi}
            </Text>
          </Box>
        )}
      </Box>
    )
  })
}
