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
import { Events } from './events'
import { changeValue } from '../utils/input'
import { Util } from './utils'

enum Selector {
  EmptyBuffer = '#TOUR_TARGET_EMPTY_BUFFER',
  EmptyBufferNotTaken = '#TOUR_TARGET_EMPTY_BUFFER:not(.prun-palette-taken)',
  NewBufferButton = '#TOUR_TARGET_BUTTON_BUFFER_NEW',
  BufferCMDElement = 'div[class^="TileFrame__cmd"]',
  TakenClass = 'prun-palette-taken',
}

export type Buffer = GConstructor<{
  createBuffer(command?: string): Promise<Element | null>
  closeBuffer(buffer: Element): void
  closeBufferWithCommand(command: string): void
  closeAllBuffers(): Promise<void>
}>

export function Buffer<TBase extends Util & Events>(Base: TBase) {
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

            this.events.emit('new-buffer', buffer, cmd ?? undefined)
          } catch (error) {
            this.events.emit('new-buffer', buffer)
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

    public closeBuffer(buffer: Element) {
      const closeButton = this.findElementWithContent(buffer, 'x')
      if (!closeButton || !(closeButton instanceof HTMLElement)) return

      closeButton.click()
    }

    public closeBufferWithCommand(command: string) {
      const buffers = document.querySelectorAll(Selector.EmptyBuffer)

      Array.from(buffers).filter((buffer) => {
        const bufferCMDElement = buffer.querySelector(Selector.BufferCMDElement)
        if (!bufferCMDElement) return false

        const bufferCMD = bufferCMDElement.textContent?.toUpperCase()
        return bufferCMD === command.toUpperCase()
      }).forEach((buffer) => {
        this.closeBuffer(buffer)
      })
    }

    public async closeAllBuffers(): Promise<void> {
      const buffers = document.querySelectorAll(Selector.EmptyBuffer)

      buffers.forEach((buffer) => {
        this.closeBuffer(buffer)
      })
    }
  }
}
