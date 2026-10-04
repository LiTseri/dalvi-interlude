export type Lang = 'el' | 'en'
export type Bilingual = { el: string; en: string }
export type Category = 'breathing' | 'movement' | 'hydration' | 'eyes' | 'mind' | 'shutdown'
export type Zone = 'morning' | 'midday' | 'afternoon' | 'evening'
export type Signal = 'long_session' | 'stuck' | 'frustrated' | 'fatigued'

export type Action = {
  id: string
  title: Bilingual
  category: Category
  durationSec: number
  ui: 'guided_timer' | 'text' | 'checklist'
  steps: { el: string[]; en: string[] }
  claim: Bilingual
  level: 'A' | 'B' | 'C'
  source: { citation: string; doi: string }
  times: (Zone | 'any')[]
  signals: Signal[]
  tags: string[]
  cautions: Bilingual
  cooldownMin: number
}

/** The suggestion waiting above the prompt; null when none. Holds no inferred state (the reason lives in module memory). */
export type Card = { actionId: string; isChoosingSnooze: boolean; isPreview: boolean } | null

/** What the /breathe pane shows. */
export type PaneView = {
  actionId: string
  isRunning: boolean
  remainingSec: number
  isBasisShown: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'dalvi-interlude': { card: Card; pane: PaneView | null; lang: Lang }
  }
}
