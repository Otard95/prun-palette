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
import './palette.sass'
import { div, p } from '../utils/dom'

import paletteInput from './paletteInput'
import EventEmitter from '../utils/event-emitter'
import { PaletteCommand } from '../palette'
import paletteMatches from './paletteMatches'
import kbd from './kbd'

type EventMap = {
  'change': [string]
  'complete': [string]
  'back': []
  'submit': [string]
}
export const paletteListener = new EventEmitter<EventMap>()

interface PaletteProps {
  fuzzNextArg: (path: string[], current: string) => string | null
  getTopMatches: (path: string[], current: string) => PaletteCommand[]
  execute: (path: string[], input: string) => Promise<unknown> | void
  close: () => void
}
export default function palette({ fuzzNextArg, getTopMatches, execute, close }: PaletteProps) {
  const path: string[] = []
  let current: string = ''
  let bestMatch: string | undefined = undefined
  let topMatches: PaletteCommand[] = []

  let paletteInputEl = paletteInput(path, current, bestMatch)
  let topMatchesListEl = paletteMatches(topMatches)

  const updatePaletteInput = () => {
    const newPaletteInputEl = paletteInput(path, current, bestMatch)
    paletteInputEl.replace$(newPaletteInputEl)
    paletteInputEl = newPaletteInputEl
  }

  const updateTopMatches = () => {
    const newTopMatchesEl = paletteMatches(topMatches)
    topMatchesListEl.replace$(newTopMatchesEl)
    topMatchesListEl = newTopMatchesEl
  }

  const onPaletteInputChange = (value: string) => {
    current = value
    bestMatch = fuzzNextArg(path, current) || undefined
    topMatches = getTopMatches(path, current)
    updatePaletteInput()
    updateTopMatches()
  }

  const onPaletteInputComplete = () => {
    if (!bestMatch && !current || topMatches.length === 0) return
    path.push(bestMatch || current)
    current = ''
    bestMatch = undefined
    topMatches = getTopMatches(path, current)
    updatePaletteInput()
    updateTopMatches()
  }

  const onPaletteInputBack = () => {
    path.pop()
    current = ''
    bestMatch = undefined
    topMatches = []
    updatePaletteInput()
    updateTopMatches()
  }

  const onPaletteInputSubmit = async () => {
    await execute(path, current.trim())
    path.length = 0
    current = ''
    bestMatch = undefined
    topMatches = []
    close()
  }

  const palette = div(
    div(
      paletteInputEl,
      topMatchesListEl,
      p(kbd('enter'), ' to select | ', kbd('tab'), ' to autocomplete | ', kbd('esc'), ' to close')
        .att$('class', 'palette-help')
    ).att$('class', 'palette')
  )
    .att$('class', 'palette-container')
    .att$('id', 'prun-palette')

  palette.on('mount', () => {
    console.debug('[PrUn palette] palette mounted')
    paletteListener.on('change', onPaletteInputChange)
    paletteListener.on('complete', onPaletteInputComplete)
    paletteListener.on('back', onPaletteInputBack)
    paletteListener.on('submit', onPaletteInputSubmit)
  })

  palette.on('unmount', () => {
    console.debug('[PrUn palette] palette unmounted')
    paletteListener.off('change', onPaletteInputChange)
    paletteListener.off('complete', onPaletteInputComplete)
    paletteListener.off('back', onPaletteInputBack)
    paletteListener.off('submit', onPaletteInputSubmit)
  })

  return palette
}


