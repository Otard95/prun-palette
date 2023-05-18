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

      if (!command) { return buffer }

      const input = buffer.querySelector('input')

      if (!input) {
        throw new Error('Could not find input element')
      }

      changeValue(input, command)
      input.form?.requestSubmit()

      return buffer
    }
  }
}
