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

import { PromiseOrValue } from 'utility-types'

type ListenerFn<T extends Array<unknown>> = (...args: T) => PromiseOrValue<void>
interface Listener<T extends Array<unknown>> {
  fn: ListenerFn<T>
  once?: boolean
}

export default class EventEmitter<
  EventMap extends Record<string, Array<unknown>>
> {
  private listeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>
  } = {}

  public on<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event] || new Set<Listener<EventMap[K]>>()
    listeners.add({ fn })
    this.listeners[event] = listeners
  }

  public once<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event] || new Set<Listener<EventMap[K]>>()
    listeners.add({ fn, once: true })
    this.listeners[event] = listeners
  }

  public off<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event]
    if (!listeners) return

    listeners.forEach(listener => {
      if (listener.fn === fn) listeners.delete(listener)
    })
  }

  public emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]) {
    const listeners = this.listeners[event]
    if (!listeners) return

    listeners.forEach(listener => {
      listener.fn(...args)
      if (listener.once) listeners.delete(listener)
    })
  }

  public clear() {
    this.listeners = {}
  }
}
