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
import { GConstructor } from 'mixin'
import Apex from './base'
import { Events } from './events'
import { changeValue } from '../utils/input'

enum Selector {
  EmptyBuffer = '#TOUR_TARGET_EMPTY_BUFFER',
  EmptyBufferNotTaken = '#TOUR_TARGET_EMPTY_BUFFER:not(.prun-palette-taken)',
  NewBufferButton = '#TOUR_TARGET_BUTTON_BUFFER_NEW',
  BufferCMDElement = 'div[class^="TileFrame__cmd"]',
  TakenClass = 'prun-palette-taken',
}

export type Buffer = GConstructor<{
  createBuffer(command?: string): Promise<Element | null>
}>

export function Buffer<TBase extends GConstructor<Apex> & Events>(Base: TBase) {
  return class Buffer extends Base {
    constructor(...args: any[]) {
      super(...args)

      this.observer.addListener('add', {
        match: (element) => {
          const nodeMatches = element.matches(Selector.EmptyBuffer)
          const nodeHadMatchingChildren = element.querySelector(Selector.EmptyBuffer)
          const match = nodeMatches || !!nodeHadMatchingChildren
          return match
        },
        callback: async (element) => {
          const buffer = element.matches(Selector.EmptyBuffer)
            ? element
            : element.querySelector(Selector.EmptyBuffer)

          if (!buffer) return

          try {
            const bufferCMDElement = await this.observer.waitFor(Selector.BufferCMDElement)
            const cmd = bufferCMDElement.textContent

            console.debug('[PrUn Palette] New buffer', buffer, cmd)
            this.events.emit('new-buffer', buffer, cmd ?? undefined)
          } catch (error) {
            console.error('[PrUn Palette] Could not find buffer CMD element in time', error)
          }
        },
      })
    }

    private get newBufferButton(): HTMLButtonElement | null {
      return document.querySelector(Selector.NewBufferButton)
    }

    public async createBuffer(command?: string): Promise<Element | null> {
      if (this.newBufferButton === null) return null

      const bufferPromise = this.observer.waitFor(Selector.EmptyBufferNotTaken)

      this.newBufferButton.click()
      const buffer = await bufferPromise

      buffer.classList.add(Selector.TakenClass)

      if (!command) return buffer

      const input = buffer.querySelector('input')

      if (!input) {
        throw new Error('Could not find input element')
      }

      changeValue(input, command.toUpperCase())
      input.form?.requestSubmit()

      return buffer
    }
  }
}
