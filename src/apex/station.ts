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
import Apex from "./base";
import { GConstructor } from 'mixin'

interface StationItem {
  name: string
  system: string
  location: string
}

export type Station = GConstructor<{
  get Stations(): StationItem[]
}>

export function Station<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Station extends Base {
    protected stations: Set<StationItem>

    constructor(...args: any[]) {
      super(...args)
      this.stations = new Set(
        [
          { name: 'Antares', system: 'Antares I', location: 'Antares Station (Antares I)' },
          { name: 'Arclight', system: 'Arclight', location: 'Arclight Station (Arclight)' },
          { name: 'Benten', system: 'Benten', location: 'Benten Station (Benten)' },
          { name: 'Hortus', system: 'Hortus', location: 'Hortus Station (Hortus)' },
          { name: 'Hubur', system: 'Hubur', location: 'Hubur Station (Hubur)' },
          { name: 'Moria', system: 'Moria', location: 'Moria Station (Moria)' }
        ]
      )
    }

    public get Stations(): StationItem[] {
      return [...this.stations.values()]
    }
  }
}
