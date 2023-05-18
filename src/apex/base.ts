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
import Deferred from '../utils/deferred'
import DocumentObserver from '../document-observer'
import { changeValue } from '../utils/input'
import { memoize } from '../utils/memoize'
import { fetchFIOPlanets, fetchFIOSystems } from '../fio'

interface Screen {
  name: string
  open: () => void
  delete: () => void
  copy: () => void
}
interface Planet {
  id: string
  name: string
}
interface System {
  id: string
  name: string
}

export default class Apex {
  private readyPromise: Promise<void>
  private observer: DocumentObserver
  private planets: Planet[] = []
  private systems: System[] = []

  private static _requiredSelectors = [
    '.Frame__main___Psr0SIB',
    '#TOUR_TARGET_BUTTON_BUFFER_NEW',
  ]

  private static hasRequiredElements(): boolean {
    return Apex._requiredSelectors.every((selector) => {
      return document.querySelector(selector)
    })
  }

  constructor() {
    const deferred = new Deferred<void>()
    this.readyPromise = deferred.promise

    if (Apex.hasRequiredElements()) {
      deferred.resolve()
    }

    this.observer = new DocumentObserver()
    this.observer.addListener('add', {
      match: () => {
        return Apex.hasRequiredElements()
      },
      callback: () => {
        deferred.resolve()
      },
      once: true
    })

    fetchFIOPlanets().then((planets) => planets && (this.planets = planets))
    fetchFIOSystems().then((systems) => systems && (this.systems = systems))
  }

  public get ready(): Promise<void> {
    return this.readyPromise
  }

  // @memoize(100)
  // private get screenControls(): HTMLDivElement | null {
  //   return document.querySelector('#TOUR_TARGET_SCREEN_CONTROLS')
  // }

  // @memoize(100)
  // private get screenList(): HTMLUListElement | null {
  //   return document
  //     .querySelector('#TOUR_TARGET_SCREEN_CONTROLS')
  //     ?.querySelector('ul')
  //     ?? null
  // }

  public get Planets(): Planet[] {
    return this.planets
  }

  public get Systems(): System[] {
    return this.systems
  }

  @memoize(100)
  public get Screens(): Screen[] {
    const screenList = document
      .querySelector('#TOUR_TARGET_SCREEN_CONTROLS')
      ?.querySelector('ul')
      ?? null
    if (screenList === null) return []

    const listItems = Array.from(screenList.querySelectorAll('li'))

    return listItems.map((listItem): Screen | null => {
      const a = listItem.querySelector('a')
      if (!a) return null

      const name = a.textContent?.trim()
      if (!name) return null

      const href = a.getAttribute('href')
      if (!href) return null

      let deleteButton: HTMLDivElement | null = null
      let copyButton: HTMLDivElement | null = null
      listItem.querySelectorAll('div').forEach((div) => {
        if (div.textContent?.trim().toLowerCase() === 'del') {
          deleteButton = div
        } else if (div.textContent?.trim().toLowerCase() === 'cpy') {
          copyButton = div
        }
      })

      if (!deleteButton || !copyButton) return null

      return {
        name,
        open: () => location.hash = href,
        delete: () => deleteButton?.click(),
        copy: () => copyButton?.click(),
      }
    }).filter((screen): screen is Screen => screen !== null)
  }

  @memoize(100)
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
