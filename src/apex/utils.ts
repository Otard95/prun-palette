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
import Apex from './base'
import { GConstructor } from 'mixin'

export type TableMatch = Array<string | RegExp | undefined>

type NodeListOrArray<T extends Element> = NodeListOf<T> | T[]

export type Util = GConstructor<
  {
    findMatchingRows: (
      rows: NodeListOrArray<HTMLTableRowElement>,
      match: TableMatch
    ) => Element[]
    findMatchingRow: (
      rows: NodeListOrArray<HTMLTableRowElement>,
      match: TableMatch
    ) => Element | null
    findElementWithContent: (
      parent: Element,
      content: string | RegExp
    ) => Element | null
  } & Apex
>

export function Util<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Util extends Base {
    private resolveToArray(elements: NodeListOrArray<Element>): Element[] {
      return Array.isArray(elements) ? elements : Array.from(elements)
    }

    public findMatchingRows(
      rows: NodeListOrArray<HTMLTableRowElement>,
      match: TableMatch
    ): Element[] {
      return this.resolveToArray(rows).filter(row => {
        return match.every((match, i) => {
          if (!match) return true
          if (typeof match === 'string') {
            return (
              row
                .querySelector(`td:nth-child(${i + 1})`)
                ?.textContent?.trim() === match
            )
          }
          if (match instanceof RegExp) {
            const col = row
              .querySelector(`td:nth-child(${i + 1})`)
              ?.textContent?.trim()
            if (!col) return false
            return match.test(col)
          }
          return false
        })
      })
    }

    public findMatchingRow(
      rows: NodeListOrArray<HTMLTableRowElement>,
      match: TableMatch
    ): Element | null {
      const matchingRows = this.findMatchingRows(rows, match)
      if (matchingRows.length === 0) return null
      return matchingRows[0]
    }

    public findElementWithContent(
      parent: Element,
      content: string | RegExp
    ): Element | null {
      const elements = Array.from(parent.querySelectorAll('*'))
      return (
        elements.find(element => {
          if (typeof content === 'string') {
            return element.textContent?.trim() === content
          }
          const text = element.textContent?.trim()
          if (!text) return false
          return content.test(text)
        }) ?? null
      )
    }
  }
}
