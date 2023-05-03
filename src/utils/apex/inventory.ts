import ApexUtils from "./utils"

type InventoryMatch = [type: string | RegExp, location?: string | RegExp, name?: string | RegExp]

export default class ApexInventory extends ApexUtils {

  private async openInventoriesBuffer(): Promise<
    {
      inventoryBuffer: Element | null,
      inventoryRows: Element[]
    }
    | null
  > {
    const inventoryBuffer = await this.apex.createBuffer('INV')
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
      console.debug('[PrUn Palette](openBaseInventory) Could not find open button')
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
