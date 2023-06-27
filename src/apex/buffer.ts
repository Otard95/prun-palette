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
import { BufferSelector } from '../utils/constants'
import { settingsStore } from '../settings/settings-store'
import { LocalStorageStore } from '../utils/store/LocalStorageStore'

interface BufferState {
  size?: { width: number; height: number }
  position?: { x: number; y: number }
}
interface BufferStateMap {
  [cmd: string]: BufferState
}
const bufferStateStore = new LocalStorageStore<BufferStateMap>(
  'PrUn-Palette-BufferState',
  {
    'prun settings': {
      size: { width: 600, height: 400 },
    },
  }
)

export type Buffer = GConstructor<{
  createBuffer(command?: string): Promise<Element | null>
  closeBuffer(buffer: Element): void
  closeBufferWithCommand(command: string): void
  closeAllBuffers(): Promise<void>
}>

export function Buffer<TBase extends Util & Events>(Base: TBase) {
  return class Buffer extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)

      this.observer.addListener('add', {
        match: element => {
          const nodeMatches = element.matches(BufferSelector.EmptyBuffer)
          const nodeHadMatchingChildren = element.querySelector(
            BufferSelector.EmptyBuffer
          )
          const match = nodeMatches || !!nodeHadMatchingChildren
          return match
        },
        callback: async element => {
          const buffer = element.matches(BufferSelector.EmptyBuffer)
            ? element
            : element.querySelector(BufferSelector.EmptyBuffer)

          if (!buffer) return

          try {
            const bufferCMDElement = await this.observer.waitFor(
              BufferSelector.BufferCMDElement,
              { within: buffer }
            )
            const cmd = bufferCMDElement.textContent

            this.events.emit('new-buffer', buffer, cmd ?? undefined)
            this.rememberBufferState(buffer, cmd ?? undefined)
          } catch (error) {
            this.events.emit('new-buffer', buffer)
          }
        },
      })
    }

    private get newBufferButton(): HTMLButtonElement | null {
      return document.querySelector(BufferSelector.NewBufferButton)
    }

    public async createBuffer(command?: string): Promise<Element | null> {
      if (this.newBufferButton === null) return null

      const bufferPromise = this.observer.waitFor(
        BufferSelector.EmptyBufferNotTaken,
        { onlyNew: true }
      )

      this.newBufferButton.click()
      const buffer = await bufferPromise

      buffer.classList.add(BufferSelector.TakenClass)

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
      const buffers = document.querySelectorAll(BufferSelector.EmptyBuffer)

      Array.from(buffers)
        .filter(buffer => {
          const bufferCMDElement = buffer.querySelector(
            BufferSelector.BufferCMDElement
          )
          if (!bufferCMDElement) return false

          const bufferCMD = bufferCMDElement.textContent?.toUpperCase()
          return bufferCMD === command.toUpperCase()
        })
        .forEach(buffer => {
          this.closeBuffer(buffer)
        })
    }

    public async closeAllBuffers(): Promise<void> {
      const buffers = document.querySelectorAll(BufferSelector.EmptyBuffer)

      buffers.forEach(buffer => {
        this.closeBuffer(buffer)
      })
    }

    // ###############################
    // #        Buffer state         #
    // ###############################

    private setBufferPosition(
      buffer: Element,
      position: Required<BufferState>['position']
    ) {
      if (settingsStore.get('rememberBufferPosition') === false) return

      const positionable = buffer.matches(BufferSelector.EmptyBuffer)
        ? buffer
        : buffer.querySelector(BufferSelector.EmptyBuffer)
      if (positionable instanceof HTMLElement) {
        positionable.style.top = `${position.y}px`
        positionable.style.left = `${position.x}px`
      }
    }

    private setBufferSize(
      buffer: Element,
      size: Required<BufferState>['size']
    ) {
      const cmd = buffer.querySelector(
        BufferSelector.BufferCMDElement
      )?.textContent
      if (
        settingsStore.get('rememberBufferSize') === false &&
        cmd !== 'prun settings'
      )
        return

      const resizeable = buffer.querySelector(BufferSelector.Body)
      if (resizeable instanceof HTMLElement) {
        resizeable.style.width = `${size.width}px`
        resizeable.style.height = `${size.height}px`
      }
    }

    private setBufferState(buffer: Element, state: BufferState) {
      if (state.position) this.setBufferPosition(buffer, state.position)
      if (state.size) this.setBufferSize(buffer, state.size)
    }

    private observeBufferPosition(buffer: Element, cmd: string) {
      if (settingsStore.get('rememberBufferPosition') === false) return
      const bufferObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          const { type, attributeName, target } = mutation
          if (type !== 'attributes' || attributeName !== 'style') return
          if (
            target instanceof HTMLElement &&
            target.matches(BufferSelector.EmptyBuffer)
          ) {
            const x = parseInt(target.style.left.replace('px', ''))
            const y = parseInt(target.style.top.replace('px', ''))
            if (x && y) {
              const currentState = bufferStateStore.get(cmd) ?? {}
              bufferStateStore.set(cmd, { ...currentState, position: { x, y } })
            }
          }
        })
      })
      bufferObserver.observe(buffer, {
        attributes: true,
      })
    }

    private observeBufferSize(buffer: Element, cmd: string) {
      if (settingsStore.get('rememberBufferSize') === false) return
      const body = buffer.querySelector(BufferSelector.Body)
      if (!body) return
      const bufferObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          const { type, attributeName, target } = mutation
          if (type !== 'attributes' || attributeName !== 'style') return
          if (
            target instanceof HTMLElement &&
            target.matches(BufferSelector.Body)
          ) {
            const width = parseInt(target.style.width.replace('px', ''))
            const height = parseInt(target.style.height.replace('px', ''))
            if (width && height) {
              const currentState = bufferStateStore.get(cmd) ?? {}
              bufferStateStore.set(cmd, {
                ...currentState,
                size: { width, height },
              })
            }
          }
        })
      })
      bufferObserver.observe(body, {
        attributes: true,
      })
    }

    private rememberBufferState(buffer: Element, cmd?: string) {
      if (!cmd) return

      const bufferState = bufferStateStore.get(cmd)
      if (bufferState) this.setBufferState(buffer, bufferState)

      this.observeBufferPosition(buffer, cmd)
      this.observeBufferSize(buffer, cmd)
    }
  }
}
