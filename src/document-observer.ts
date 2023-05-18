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
import Deferred from './utils/deferred'

interface ElementListener {
  match: (element: Element) => boolean,
  callback: (element: Element) => void,
  once?: boolean
  consume?: boolean
}

export default class DocumentObserver {
  private observer: MutationObserver
  private listeners: {
    added: ElementListener[],
    removed: ElementListener[],
    changed: ElementListener[],
  } = {
    added: [],
    removed: [],
    changed: [],
  }

  constructor() {
    this.observer = new MutationObserver(this.handleMutations.bind(this))
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    })
  }

  private handleMutations(mutations: MutationRecord[]) {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        for (const listener of this.listeners.added) {
          if (node instanceof Element && listener.match(node)) {
            listener.callback(node)
            if (listener.once) {
              this.removeListener('add', listener)
            }
            if (listener.consume) {
              return
            }
          }
        }
      })
    })
  }

  public addListener(on: 'add' | 'remove' | 'change', listener: ElementListener) {
    switch (on) {
      case 'add':
        this.listeners.added.push(listener)
        break
      case 'remove':
        this.listeners.removed.push(listener)
        break
      case 'change':
        this.listeners.changed.push(listener)
        break
    }
  }

  public removeListener(on: 'add' | 'remove' | 'change', listener: ElementListener) {
    switch (on) {
      case 'add':
        this.listeners.added.splice(this.listeners.added.indexOf(listener), 1)
        break
      case 'remove':
        this.listeners.removed.splice(this.listeners.removed.indexOf(listener), 1)
        break
      case 'change':
        this.listeners.changed.splice(this.listeners.changed.indexOf(listener), 1)
        break
    }
  }

  public async waitFor(selector: string, timeout: number = 1000) {
    const deferred = new Deferred<Element>()
    const listener: ElementListener = {
      match: (element) => {
        const nodeMatches = element.matches(selector)
        const nodeHadMatchingChildren = element.querySelector(selector)
        const match = nodeMatches || !!nodeHadMatchingChildren
        return match
      },
      callback: (element) => {
        const matchingElement = element.matches(selector) ? element : element.querySelector(selector)
        if (!matchingElement) {
          throw new Error(`Element matching selector '${selector}' was removed before it could be returned`)
        }
        deferred.resolve(matchingElement)
      },
      once: true,
    }

    const timer = setTimeout(() => {
      this.removeListener('add', listener)
      deferred.reject(new Error(`Timeout waiting for element matching selector '${selector}'`))
    }, timeout)

    deferred.promise.then((el) => {
      clearTimeout(timer)
      return el
    })

    this.addListener('add', listener)

    return deferred.promise
  }
}


