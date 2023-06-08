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

export default class Apex {
  private readyPromise: Promise<void>
  protected observer: DocumentObserver

  private static _requiredSelectors = [
    '.Frame__main___Psr0SIB',
    '#TOUR_TARGET_BUTTON_BUFFER_NEW',
  ]

  private static hasRequiredElements(): boolean {
    return Apex._requiredSelectors.every(selector => {
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
      once: true,
    })
  }

  public get ready(): Promise<void> {
    return this.readyPromise
  }
}
