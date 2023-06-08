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
type EphemeralArrayOnTimeoutHandler<T> = (items: T[]) => void

/**
 * An array which items are one persisted for a given time after the array was
 * last modified.
 */
export default class EphemeralArray<T> extends Array<T> {
  private timeout: number | null = null
  private onTimeoutHandlers: EphemeralArrayOnTimeoutHandler<T>[] = []

  constructor(private readonly ttl: number) {
    super()
  }

  public push(...items: T[]) {
    this.resetTimeout()
    return super.push(...items)
  }

  public unshift(...items: T[]) {
    this.resetTimeout()
    return super.unshift(...items)
  }

  public pop() {
    const item = super.pop()
    this.resetTimeout()
    return item
  }

  public shift() {
    const item = super.shift()
    this.resetTimeout()
    return item
  }

  private resetTimeout() {
    if (this.timeout !== null) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.onTimeoutHandlers.forEach(handler => handler(this))
      this.length = 0
    }, this.ttl) as unknown as number
  }

  public onTimeout(callback: EphemeralArrayOnTimeoutHandler<T>) {
    this.onTimeoutHandlers.push(callback)
  }
}
