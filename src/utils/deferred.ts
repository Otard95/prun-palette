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
export default class Deferred<T> {
  private _resolve: (value: T | PromiseLike<T>) => void = () => {}
  private _reject: (reason?: any) => void = () => null
  private _promise: Promise<T>

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  public get promise(): Promise<T> {
    return this._promise
  }

  public get resolve(): (value: T | PromiseLike<T>) => void {
    return this._resolve
  }

  public get reject(): (reason?: any) => void {
    return this._reject
  }
}
