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
import { Store } from './interface'

type Subscriber<State extends Record<string, unknown>> = {
  [K in keyof State]?: Array<(value: State[K] | undefined) => void>
}

export class InMemoryStore<State extends Record<string, unknown>>
  implements Store<State>
{
  private state: Partial<State> = {}
  private subscribers: Subscriber<State> = {}

  constructor(initialState: Partial<State> = {}) {
    this.state = initialState
  }

  get State(): Partial<State> {
    return { ...this.state }
  }

  get<K extends keyof State>(key: K): State[K] | undefined {
    return this.state[key]
  }

  set<K extends keyof State>(key: K, value: State[K] | undefined): void {
    this.state[key] = value
    const callbacks = this.subscribers[key]
    if (callbacks) {
      callbacks.forEach(callback => callback(value))
    }
  }

  merge(state: Partial<State>): void {
    this.state = { ...this.state, ...state }
  }

  subscribe<K extends keyof State>(
    key: K,
    callback: (value: State[K] | undefined) => void
  ): void {
    const callbacks = this.subscribers[key] || []
    callbacks.push(callback)
    this.subscribers[key] = callbacks
  }

  unsubscribe<K extends keyof State>(
    key: K,
    callback: (value: State[K] | undefined) => void
  ): void {
    const callbacks = this.subscribers[key] || []
    this.subscribers[key] = callbacks.filter(cb => cb !== callback)
  }
}
