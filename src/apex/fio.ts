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
import Apex from './base'
import { GConstructor } from 'mixin'
import { fetchFIOPlanets, fetchFIOSystems } from '../fio'

export interface Planet {
  id: string
  name: string
}
export interface System {
  id: string
  name: string
}

export type FIO = GConstructor<{
  get Planets(): Planet[]
  get Systems(): System[]
}>

export function FIO<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class FIO extends Base {
    private planets: Planet[] = []
    private systems: System[] = []

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)

      fetchFIOPlanets()
        .then(planets => planets && (this.planets = planets))
        .catch(error =>
          console.error('[PrUn Palette] Failed to fetch planets', error)
        )
      fetchFIOSystems()
        .then(systems => systems && (this.systems = systems))
        .catch(error =>
          console.error('[PrUn Palette] Failed to fetch systems', error)
        )
    }

    public get Planets(): Planet[] {
      return this.planets
    }

    public get Systems(): System[] {
      return this.systems
    }
  }
}
