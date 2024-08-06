/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2024  Stian Myklebostad

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

export interface ScreenItem {
  name: string
  open: () => void
  delete: () => void
  copy: () => void
}

export type Screen = GConstructor<{
  get Screens(): ScreenItem[]
}>

export function Screen<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Screen extends Base {
    public get Screens(): ScreenItem[] {
      const screenList =
        document
          .querySelector('#TOUR_TARGET_SCREEN_CONTROLS')
          ?.querySelector('ul') ?? null
      if (screenList === null) return []

      const listItems = Array.from(screenList.querySelectorAll('li'))

      return listItems
        .map((listItem): ScreenItem | null => {
          const a = listItem.querySelector('a')
          if (!a) return null

          const name = a.textContent?.trim()
          if (!name) return null

          const href = a.getAttribute('href')
          if (!href) return null

          let deleteButton: HTMLDivElement | null = null
          let copyButton: HTMLDivElement | null = null
          listItem.querySelectorAll('div').forEach(div => {
            if (div.textContent?.trim().toLowerCase() === 'del') {
              deleteButton = div
            } else if (div.textContent?.trim().toLowerCase() === 'cpy') {
              copyButton = div
            }
          })

          if (!deleteButton || !copyButton) return null

          return {
            name,
            open: () => (location.hash = href),
            delete: () => deleteButton?.click(),
            copy: () => copyButton?.click(),
          }
        })
        .filter((screen): screen is ScreenItem => screen !== null)
    }
  }
}
