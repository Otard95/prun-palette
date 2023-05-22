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

export type Buffer = GConstructor<{
  createBuffer(command?: string): Promise<Element | null>
}>

export function Buffer<TBase extends GConstructor<Apex> & Events>(Base: TBase) {
  return class Buffer extends Base {
    private get newBufferButton(): HTMLButtonElement | null {
      return document.querySelector('#TOUR_TARGET_BUTTON_BUFFER_NEW')
    }

    public async createBuffer(command?: string): Promise<Element | null> {
      if (this.newBufferButton === null) return null

      const bufferPromise = this.observer.waitFor('#TOUR_TARGET_EMPTY_BUFFER:not(.prun-palette-taken)')

      this.newBufferButton.click()
      const buffer = await bufferPromise

      buffer.classList.add('prun-palette-taken')

      if (!command) {
        this.events.emit('new-buffer', buffer)
        return buffer
      }

      const input = buffer.querySelector('input')

      if (!input) {
        throw new Error('Could not find input element')
      }

      changeValue(input, command)
      input.form?.requestSubmit()

      this.events.emit('new-buffer', buffer, command)

      return buffer
    }
  }
}
