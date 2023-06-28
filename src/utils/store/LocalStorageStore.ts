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
import { InMemoryStore } from './InMemoryStore'
import { Store } from './interface'

export class LocalStorageStore<State extends Record<string, unknown>>
  extends InMemoryStore<State>
  implements Store<State>
{
  constructor(
    private localStorageKey: string,
    initialState: Partial<State> = {}
  ) {
    super(initialState)
    this.merge(this.loadFromLocalStorage())
  }

  set<K extends keyof State>(key: K, value: State[K] | undefined): void {
    super.set(key, value)
    this.saveToLocalStorage()
  }

  private loadFromLocalStorage(): Partial<State> {
    const json = localStorage.getItem(this.localStorageKey)
    return json ? JSON.parse(json) : {}
  }

  private saveToLocalStorage(): void {
    const json = JSON.stringify(this.State)
    localStorage.setItem(this.localStorageKey, json)
  }
}
