import EventEmitter from "./event-emitter"

type ElEventMap = {
  'mount': []
  'unmount': []
}
export interface El extends HTMLElement, EventEmitter<ElEventMap> {
  att$(name: string, value: string): El
  onClick$(callback: () => void): El
  onChange$(callback: () => void): El
  onKeyUp$(callback: (e: KeyboardEvent) => void): El
  onKeyDown$(callback: (e: KeyboardEvent) => void): El
  replace$(element: El): El
  mount$(on: HTMLElement): El
  unmount$(): El
}

export type Child = HTMLElement | El | string | number | boolean | null | undefined
export type Children = Child[]

function isEl(el: unknown): el is El {
  return el instanceof HTMLElement
    && typeof((el as any).on) === 'function'
    && typeof((el as any).once) === 'function'
    && typeof((el as any).off) === 'function'
    && typeof((el as any).emit) === 'function'
    && typeof((el as any).clear) === 'function'
    && typeof((el as any).att$) === 'function'
    && typeof((el as any).onClick$) === 'function'
    && typeof((el as any).onChange$) === 'function'
    && typeof((el as any).onKeyUp$) === 'function'
    && typeof((el as any).onKeyDown$) === 'function'
    && typeof((el as any).replace$) === 'function'
    && typeof((el as any).mount$) === 'function'
    && typeof((el as any).unmount$) === 'function'
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

export function tag(name: string, ...children: Children): El {
  const result = document.createElement(name) as El
  extendWithEventEmitter(result)
  for (const child of children) {
    switch (typeof (child)) {
      case 'string':
      case 'number':
        result.appendChild(document.createTextNode(String(child)))
      case 'boolean':
      case 'undefined':
        break
      default:
        if (isEl(child))
          result.appendChild(child)
    }
  }

  result.att$ = function(name, value) {
    this.setAttribute(name, value)
    return this
  }

  result.onClick$ = function(callback) {
    this.onclick = callback
    return this
  }

  result.onChange$ = function(callback) {
    this.onchange = callback
    return this
  }

  result.onKeyUp$ = function(callback) {
    this.onkeyup = callback
    return this
  }

  result.onKeyDown$ = function(callback) {
    this.onkeydown = callback
    return this
  }

  result.replace$ = function(element) {
    this.emit('unmount')
    this.replaceWith(element)
    element.emit('mount')
    return this
  }

  result.mount$ = function(on) {
    on.appendChild(this)
    this.emit('mount')
    return this
  }

  result.unmount$ = function() {
    this.emit('unmount')
    this.remove()
    return this
  }

  result.on('mount', () => {
    children.forEach((child) => {
      if (isEl(child)) {
        child.emit('mount')
      }
    })
  })

  return result
}

export function h1(...children: Children) {
  return tag('h1', ...children)
}

export function h2(...children: Children) {
  return tag('h2', ...children)
}

export function h3(...children: Children) {
  return tag('h3', ...children)
}

export function p(...children: Children) {
  return tag('p', ...children)
}

export function a(href: string, ...children: Children) {
  return tag('a', ...children).att$('href', href)
}

export function div(...children: Children) {
  return tag('div', ...children)
}

export function span(...children: Children) {
  return tag('span', ...children)
}

export function img(src: string) {
    return tag('img').att$('src', src)
}

export function select(...children: Children) {
  return tag('select', ...children)
}

export function input(type: string) {
  return tag('input').att$('type', type)
}
