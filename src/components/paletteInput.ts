/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2023  Stian Myklebostad

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
import './paletteInput.sass'
import { div } from '../utils/dom'
import { paletteListener } from './palette'

const cursorEnd = (el: HTMLElement) => {
  const range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export default function paletteInput(
  path: string[] = [],
  current = '',
  bestMatch?: string
) {
  const input = div(current)
  input
    .att$('contenteditable', 'true')
    .onKeyDown$(e => {
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
    ? bestMatch.startsWith(current)
      ? bestMatch.slice(current.length)
      : ` · ${bestMatch}`
    : undefined

  const container = div(
    ...path.map(p =>
      div(p.concat(' ·')).att$('class', 'prun-palette prun-input-path')
    ),
    input,
    bestMatchSuffix &&
      div(bestMatchSuffix).att$('class', 'prun-alette-input-best-match')
  ).att$('class', 'prun-palette prun-input')

  container.onClick$(() => focus())

  return container
}
