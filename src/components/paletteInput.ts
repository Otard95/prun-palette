import './paletteInput.sass'
import { div } from '../utils/dom'
import { paletteListener } from './palette'

const cursorEnd = (el: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(el);
  range.collapse(false);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}


export default function paletteInput(
  path: string[] = [],
  current: string = '',
  bestMatch?: string,
) {
  const input = div(current)
  input
    .att$('contenteditable', 'true')
    .onKeyDown$((e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        return paletteListener.emit('complete', input.innerText)
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        return paletteListener.emit('submit', input.innerText)
      }
      if (e.key === 'Backspace' && input.innerText === '') {
        e.preventDefault()
        return paletteListener.emit('back')
      }
    })
    .onKeyUp$(() => {
      paletteListener.emit('change', input.innerText)
    })

  const focus = () => {
    input.focus()
    cursorEnd(input)
  }

  input.on('mount', focus)

  const bestMatchSuffix = bestMatch
    ? bestMatch.startsWith(current) ? bestMatch.slice(current.length) : ` · ${bestMatch}`
    : undefined

  const container = div(
    ...path.map((p) => div(p.concat(' ·')).att$('class', 'palette-input-path')),
    input,
    bestMatchSuffix && div(bestMatchSuffix).att$('class', 'palette-input-best-match')
  ).att$('class', 'palette-input')

  container.onClick$(() => focus())

  return container
}
