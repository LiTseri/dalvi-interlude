import { describe, expect, mock, test } from 'claude-code/testing'

const PANE = { plugin: 'dalvi-interlude', component: 'Pane', requestId: 'interlude' } as const

describe('the /breathe pane', () => {
  test('pressing a category changes the break shown', async ($, on) => {
    mock.store(on)
    mock.clock(on, { now: new Date(2026, 9, 3, 20, 30).getTime() })
    on('ui.open', ($, e) => ({ value: { isPlaced: true, id: e.id, title: e.title ?? '', isShown: true, isFocused: false } }))
    on('ui.close', () => ({ value: undefined }))
    await $.command.run({ command: 'breathe', args: 'κλείσιμο' } as never)
    const props = { title: 'x', isFocused: true, bodyColumns: 80, placement: 'dock', scroll: undefined, view: undefined } as never
    const ui = await $.ui.mount({ ...PANE, surface: 'terminal', props })
    const before = JSON.stringify(await ui.drawn())
    await ui.press({ key: 'cat-eyes' })
    const after = JSON.stringify(await ui.drawn())
    expect(after).not.toBe(before)
    expect(after).toContain('The research') // button copy comes from spec/ui-copy.yaml
  })
})
