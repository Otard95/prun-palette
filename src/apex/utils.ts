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
import Apex from "./base";
import { GConstructor } from 'mixin'

export type Util = GConstructor<{
  closeBuffer: (buffer: Element) => void
} & Apex>

export function Util<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Util extends Base {
    protected findElementWithContent(parent: Element, content: string): Element | null {
      const elements = Array.from(parent.querySelectorAll('*'))
      return elements.find((element) => {
        return element.textContent?.trim() === content
      }) ?? null
    }

    public closeBuffer(buffer: Element) {
      const closeButton = this.findElementWithContent(buffer, 'x')
      if (!closeButton || !(closeButton instanceof HTMLElement)) return

      closeButton.click()
    }
  }
}
