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
import EventEmitter from './event-emitter'

type ElEventMap = {
  mount: []
  unmount: []
}
export type El<E extends HTMLElement = HTMLElement> = {
  att$(name: string, value: string): El<E>
  onClick$(callback: () => void): El<E>
  onChange$(callback: () => void): El<E>
  onKeyUp$(callback: (e: KeyboardEvent) => void): El<E>
  onKeyDown$(callback: (e: KeyboardEvent) => void): El<E>
  replace$<E2 extends HTMLElement = HTMLElement>(element: El<E2>): El<E2>
  mount$(on: HTMLElement): El<E>
  unmount$(): El<E>
} & E &
  EventEmitter<ElEventMap>

export type Child =
  | HTMLElement
  | El
  | string
  | number
  | boolean
  | null
  | undefined
export type Children = Child[]

function isEl(el: unknown): el is El {
  return (
    el instanceof HTMLElement &&
    /* eslint-disable @typescript-eslint/no-explicit-any */
    typeof (el as any).on === 'function' &&
    typeof (el as any).once === 'function' &&
    typeof (el as any).off === 'function' &&
    typeof (el as any).emit === 'function' &&
    typeof (el as any).clear === 'function' &&
    typeof (el as any).att$ === 'function' &&
    typeof (el as any).onClick$ === 'function' &&
    typeof (el as any).onChange$ === 'function' &&
    typeof (el as any).onKeyUp$ === 'function' &&
    typeof (el as any).onKeyDown$ === 'function' &&
    typeof (el as any).replace$ === 'function' &&
    typeof (el as any).mount$ === 'function' &&
    typeof (el as any).unmount$ === 'function'
    /* eslint-enable @typescript-eslint/no-explicit-any */
  )
}

function extendWithEventEmitter(el: El) {
  const emitter = new EventEmitter<ElEventMap>()

  el.on = (event, fn) => {
    emitter.on(event, fn)
  }

  el.once = (event, fn) => {
    emitter.once(event, fn)
  }

  el.off = (event, fn) => {
    emitter.off(event, fn)
  }

  el.emit = (event, ...args) => {
    emitter.emit(event, ...args)
  }

  el.clear = () => {
    emitter.clear()
  }
}

export function tag<E extends HTMLElement>(
  name: string,
  ...children: Children
): El<E> {
  const result = document.createElement(name) as El
  extendWithEventEmitter(result)
  for (const child of children) {
    switch (typeof child) {
      case 'string':
      case 'number':
        result.appendChild(document.createTextNode(String(child)))
      case 'boolean':
      case 'undefined':
        break
      default:
        if (isEl(child)) result.appendChild(child)
    }
  }

  result.att$ = function (name, value) {
    this.setAttribute(name, value)
    return this
  }

  result.onClick$ = function (callback) {
    this.onclick = callback
    return this
  }

  result.onChange$ = function (callback) {
    this.onchange = callback
    return this
  }

  result.onKeyUp$ = function (callback) {
    this.onkeyup = callback
    return this
  }

  result.onKeyDown$ = function (callback) {
    this.onkeydown = callback
    return this
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  result.replace$ = function (element) {
    this.emit('unmount')
    this.replaceWith(element)
    element.emit('mount')
    return element
  }

  result.mount$ = function (on) {
    on.appendChild(this)
    this.emit('mount')
    return this
  }

  result.unmount$ = function () {
    this.emit('unmount')
    this.remove()
    return this
  }

  result.on('mount', () => {
    children.forEach(child => {
      if (isEl(child)) {
        child.emit('mount')
      }
    })
  })

  return result as El<E>
}

export function h1(...children: Children): El<HTMLHeadingElement> {
  return tag('h1', ...children)
}

export function h2(...children: Children): El<HTMLHeadingElement> {
  return tag('h2', ...children)
}

export function h3(...children: Children): El<HTMLHeadingElement> {
  return tag('h3', ...children)
}

export function p(...children: Children): El<HTMLParagraphElement> {
  return tag('p', ...children)
}

export function a(href: string, ...children: Children): El<HTMLAnchorElement> {
  return tag<HTMLAnchorElement>('a', ...children).att$('href', href)
}

export function div(...children: Children): El<HTMLDivElement> {
  return tag('div', ...children)
}

export function span(...children: Children): El<HTMLSpanElement> {
  return tag('span', ...children)
}

export function img(src: string): El<HTMLImageElement> {
  return tag<HTMLImageElement>('img').att$('src', src)
}

export function label(...children: Children): El<HTMLLabelElement> {
  return tag('label', ...children)
}

export function select(...children: Children): El<HTMLSelectElement> {
  return tag('select', ...children)
}
export function option(
  value: string,
  ...children: Children
): El<HTMLOptionElement> {
  return tag<HTMLOptionElement>('option', ...children).att$('value', value)
}

export function input(type: string, value?: string): El<HTMLInputElement> {
  const i = tag<HTMLInputElement>('input').att$('type', type)
  if (value) i.att$('value', value)
  return i
}

export function button(...children: Children): El<HTMLButtonElement> {
  return tag('button', ...children)
}

export function table(...children: Children): El<HTMLTableElement> {
  return tag('table', ...children)
}
export function thead(...children: Children): El<HTMLTableSectionElement> {
  return tag('thead', ...children)
}
export function tbody(...children: Children): El<HTMLTableSectionElement> {
  return tag('tbody', ...children)
}
export function tr(...children: Children): El<HTMLTableRowElement> {
  return tag('tr', ...children)
}
export function th(...children: Children): El<HTMLTableHeaderCellElement> {
  return tag('th', ...children)
}
export function td(...children: Children): El<HTMLTableDataCellElement> {
  return tag('td', ...children)
}
