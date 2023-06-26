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
export interface Store<State extends Record<string, unknown>> {
  get State(): Partial<State>
  get<K extends keyof State>(key: K): State[K] | undefined
  set<K extends keyof State>(key: K, value: State[K] | undefined): void
  merge(state: Partial<State>): void
  subscribe<K extends keyof State>(
    key: K,
    callback: (value: State[K] | undefined) => void
  ): void
  unsubscribe<K extends keyof State>(
    key: K,
    callback: (value: State[K] | undefined) => void
  ): void
}
