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
import { GConstructor } from 'mixin'
import { Buffer } from './buffer'
import { Events } from './events'
import { Util } from './utils'

interface ShipWithTransponder {
  transponder: string
  name?: string
}
interface ShipWithName {
  transponder?: string
  name: string
}
type ShipInfo = ShipWithTransponder | ShipWithName

export type Ships = GConstructor<{
  get Ships(): ShipInfo[]
}>

export function Ships<TBase extends Events & Util & Buffer>(Base: TBase) {
  return class Ships extends Base {
    private ships: Set<ShipInfo>

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)

      this.ships = new Set()
      try {
        this.loadShipInfo()
      } catch (e) {
        console.debug('[PrUn Palette] Failed to parse ships from localStorage')
      }

      this.events.on('new-buffer', (buffer, command) => {
        if (command?.toLowerCase() === 'inv')
          this.getShipNamesFromInventory(buffer)
        if (command?.toLowerCase() === 'flt') this.getShipNamesFromFleet(buffer)
      })
    }

    private storeShipInfo(): void {
      localStorage.setItem('ships', JSON.stringify(this.Ships))
    }

    private loadShipInfo(): void {
      const ships = localStorage.getItem('ships')
      if (ships) {
        this.ships = new Set(JSON.parse(ships))
      }
    }

    private mergeShipInfo(shipInfo: ShipInfo[]): void {
      shipInfo.forEach(ship => {
        const existingShip = [...this.ships.values()].find(s => {
          if (ship.transponder && s.transponder === ship.transponder)
            return true
          if (ship.name && s.name === ship.name) return true
          return false
        })
        if (existingShip) {
          this.ships.delete(existingShip)
        }
        this.ships.add({
          ...existingShip,
          ...ship,
        })
      })
      this.storeShipInfo()
    }

    private async getShipNamesFromInventory(buffer: Element): Promise<void> {
      await this.observer.waitFor('tr', { within: buffer })
      const rows = buffer.querySelectorAll('tr')
      if (!rows) {
        console.debug('[PrUn Palette] Failed to find rows in inventory buffer')
        return
      }

      const shipRows = this.findMatchingRows(rows, ['Cargo hold'])
      if (!shipRows) return

      const shipInfo = shipRows
        .map<ShipInfo | null>(row => {
          const shipNameColumn = row.querySelector('td:nth-child(3)')
          if (!shipNameColumn) return null

          const shipName = shipNameColumn.textContent
          if (!shipName) return null

          return {
            name: shipName,
          }
        })
        .filter((shipInfo): shipInfo is ShipInfo => shipInfo !== null)

      this.mergeShipInfo(shipInfo)
    }

    private async getShipNamesFromFleet(buffer: Element): Promise<void> {
      await this.observer.waitFor('tr', { within: buffer })
      const rows = buffer.querySelectorAll('tr')
      if (!rows) {
        console.debug('[PrUn Palette] Failed to find rows in fleet buffer')
        return
      }

      const shipInfo = Array.from(rows)
        .map<Partial<ShipInfo> | null>(row => {
          const shipTransponderColumn = row.querySelector('td:nth-child(1)')
          const shipNameColumn = row.querySelector('td:nth-child(2)')

          const shipTransponder = shipTransponderColumn?.textContent
          const shipName = shipNameColumn?.textContent

          return {
            ...(shipTransponder && { transponder: shipTransponder }),
            ...(shipName && { name: shipName }),
          }
        })
        .filter((shipInfo): shipInfo is ShipInfo => {
          if (shipInfo === null) return false
          if (!shipInfo.transponder && !shipInfo.name) return false
          return true
        })

      this.mergeShipInfo(shipInfo)
    }

    public get Ships(): ShipInfo[] {
      // return the this.ships set as an array
      return [...this.ships.values()]
    }

    private async waitForShipRow(
      buffer: Element,
      shipName: string
    ): Promise<Element | undefined> {
      await this.observer.waitFor('tr', { within: buffer })

      const shipRows = buffer.querySelectorAll('tr')
      const shipRow = this.findMatchingRow(shipRows, [
        undefined,
        new RegExp(`^${shipName}$`, 'i'),
      ])
      if (!shipRow) return

      return shipRow
    }

    private async waitForShipRowButtons(
      buffer: Element,
      shipName: string
    ): Promise<Element | undefined> {
      const shipRow = await this.waitForShipRow(buffer, shipName)
      if (!shipRow) return

      const fleetButtons = shipRow.querySelector(Selector.FleetButtons)
      if (!fleetButtons) return

      return fleetButtons
    }

    private async waitForShipRowButton(
      buffer: Element,
      shipName: string,
      buttonName: string
    ): Promise<HTMLButtonElement | undefined> {
      const fleetButtons = await this.waitForShipRowButtons(buffer, shipName)
      if (!fleetButtons) return

      const button = this.findElementWithContent(fleetButtons, buttonName)
      if (!button || !(button instanceof HTMLButtonElement)) return

      return button
    }
  }
}
