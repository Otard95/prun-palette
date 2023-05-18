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
import { GConstructor } from "mixin"
import { Buffer } from "./buffer"
import { Util } from "./utils"

type InventoryMatch = [type: string | RegExp, location?: string | RegExp, name?: string | RegExp]

export type Inventory = GConstructor<{
  openBaseInventory(planetName: string): Promise<void>
  openShipCargo(shipName: string): Promise<void>
  openWarehouse(systemName: string): Promise<void>
}>

export function Inventory<TBase extends Util & Buffer>(Base: TBase) {
  return class Inventory extends Base {
    private async openInventoriesBuffer(): Promise<
      {
        inventoryBuffer: Element | null,
        inventoryRows: Element[]
      }
      | null
    > {
      const inventoryBuffer = await this.createBuffer('INV')
      if (!inventoryBuffer) return null

      const tableBody = inventoryBuffer.querySelector('tbody')
      if (!tableBody) return null

      const inventoryRows = Array.from(tableBody.querySelectorAll('tr'))

      return {
        inventoryBuffer,
        inventoryRows,
      }
    }

    private clickInventoryRowOpenButton(row: Element): boolean {
      const openButton = row.querySelector('button')
      if (!openButton) {
        return false
      }

      openButton.click()
      return true
    }

    private findInventoryRowMatching(rows: Element[], match: InventoryMatch): Element | null {
      return rows.find((row) => {
        const inventoryType = row.querySelector('td:nth-child(1)')?.textContent?.trim()
        if (!inventoryType) return false

        const inventoryLocation = row.querySelector('td:nth-child(2)')?.textContent?.trim()

        const inventoryName = row.querySelector('td:nth-child(3)')?.textContent?.trim()

        const [typeMatch, locationMatch, nameMatch] = match

        if (typeof typeMatch === 'string') {
          if (inventoryType !== typeMatch) return false
        } else {
          if (!typeMatch.test(inventoryType)) return false
        }

        if (typeof locationMatch === 'string') {
          if (inventoryLocation !== locationMatch) return false
        } else if (locationMatch instanceof RegExp) {
          if (!inventoryLocation || !locationMatch.test(inventoryLocation)) return false
        }

        if (typeof nameMatch === 'string') {
          if (inventoryName !== nameMatch) return false
        } else if (nameMatch instanceof RegExp) {
          if (!inventoryName || !nameMatch.test(inventoryName)) return false
        }

        return true
      }) ?? null
    }

    public async openBaseInventory(planetName: string) {
      const { inventoryBuffer, inventoryRows } = (await this.openInventoriesBuffer()) || {}
      if (!inventoryBuffer || !inventoryRows) return

      const planetRow = this.findInventoryRowMatching(inventoryRows, [
        'Base storage',
        new RegExp(planetName, 'i'),
      ])

      if (!planetRow) {
        console.debug('[PrUn Palette](openBaseInventory) Could not find planet row')
        return
      }

      if (!this.clickInventoryRowOpenButton(planetRow)) return

      this.closeBuffer(inventoryBuffer)
    }

    public async openShipCargo(shipName: string) {
      const { inventoryBuffer, inventoryRows } = (await this.openInventoriesBuffer()) || {}
      if (!inventoryBuffer || !inventoryRows) return

      const shipRow = this.findInventoryRowMatching(inventoryRows, [
        'Cargo hold',
        undefined,
        new RegExp(shipName, 'i'),
      ])

      if (!shipRow) {
        console.debug('[PrUn Palette](openShipCargo) Could not find ship row')
        return
      }

      if (!this.clickInventoryRowOpenButton(shipRow)) return

      this.closeBuffer(inventoryBuffer)
    }

    public async openWarehouse(systemName: string) {
      const { inventoryBuffer, inventoryRows } = (await this.openInventoriesBuffer()) || {}
      if (!inventoryBuffer || !inventoryRows) return

      const warehouseRow = this.findInventoryRowMatching(inventoryRows, [
        'Warehouse unit',
        new RegExp(systemName, 'i'),
      ])

      if (!warehouseRow) {
        console.debug('[PrUn Palette](openWarehouse) Could not find warehouse row')
        return
      }

      if (!this.clickInventoryRowOpenButton(warehouseRow)) return

      this.closeBuffer(inventoryBuffer)
    }
  }
}
