import Apex from "./apex"
import Palette, { PaletteCommandVariables } from "./palette"

export default function attachCommands(palette: Palette, apex: Apex) {
  // ######################
  // #  General commands  #
  // ######################

  palette.addCommand({
    name: 'Buffer',
    description: 'Open an empty buffer',
    command: () => apex.createBuffer(),
    signature: ['buffer'],
  })
  palette.addCommand({
    name: 'Buffer command',
    description: 'Open a buffer with a command',
    command: (command: string) => apex.createBuffer(command),
    signature: ['buffer', PaletteCommandVariables.Command],
  })

  // ######################
  // # Contract commands  #
  // ######################

  palette.addCommand({
    name: 'Contracts',
    description: 'Open the contracts list',
    command: () => apex.createBuffer('CONTS'),
    signature: ['contract'],
  })
  palette.addCommand({
    name: 'Contract drafts',
    description: 'Open the contract drafts list',
    command: () => apex.createBuffer('CONTD'),
    signature: ['contract', 'drafts'],
  })
  palette.addCommand({
    name: 'Contract',
    description: 'Open a contract',
    command: (contractId: string) => apex.createBuffer(`CONT ${contractId}`),
    signature: ['contract', PaletteCommandVariables.ContractId],
  })

  // ######################
  // #   Fleet commands   #
  // ######################

  palette.addCommand({
    name: 'Fleet',
    description: 'Open the fleet list',
    command: () => apex.createBuffer('FLT'),
    signature: ['fleet'],
  })

  // ######################
  // # Inventory commands #
  // ######################

  palette.addCommand({
    name: 'Inventories',
    description: 'Open the inventories list',
    command: () => apex.createBuffer('INV'),
    signature: ['inventory'],
  })

  palette.addCommand({
    name: 'Inventory',
    description: 'Open an inventory',
    command: (inventoryId: string) => apex.createBuffer(`INV ${inventoryId}`),
    signature: ['inventory', PaletteCommandVariables.InventoryId],
  })

  palette.addCommand({
    name: 'Base inventory',
    description: 'Open the base\'s inventory',
    command: (planetName: string) => apex.openBaseInventory(planetName),
    signature: ['inventory', 'base', PaletteCommandVariables.PlanetName],
  })

  palette.addCommand({
    name: 'Ship cargo',
    description: 'Open a ship\'s cargo',
    command: (shipName: string) => apex.openShipCargo(shipName),
    signature: ['inventory', 'cargo', PaletteCommandVariables.ShipName],
  })

  palette.addCommand({
    name: 'Warehouse',
    description: 'Open a warehouse inventory',
    command: (systemName: string) => apex.openWarehouse(systemName),
    signature: ['inventory', 'warehouse', PaletteCommandVariables.SystemName],
  })

  // ######################
  // #  Screen commands   #
  // ######################

  palette.addCommand({
    name: 'Screen',
    description: 'Open a screen',
    command: (screen: string) => apex.screens
      .find((s) => s.name.toLowerCase() === screen.toLowerCase())
      ?.open(),
    signature: ['screen', PaletteCommandVariables.Screen],
  })
}
