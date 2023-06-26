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
import Apex from './apex'
import Palette, { PaletteCommandVariables } from './palette'
import { SettingsManager } from './settings'

export default function attachCommands(
  palette: Palette,
  apex: Apex,
  settingsManager: SettingsManager
) {
  // ############################
  // #     General commands     #
  // ############################

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
  palette.addCommand({
    name: 'Buffer close all',
    description: 'Close all buffers',
    command: () => apex.closeAllBuffers(),
    signature: ['buffer', 'close', 'all'],
  })
  palette.addCommand({
    name: 'Buffer close',
    description: 'Close a buffer with a command',
    command: (command: string) => apex.closeBufferWithCommand(command),
    signature: ['buffer', 'close', PaletteCommandVariables.Command],
  })

  // ############################
  // #    Contract commands     #
  // ############################

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

  // ############################
  // #      Fleet commands      #
  // ############################

  palette.addCommand({
    name: 'Fleet',
    description: 'Open the fleet list',
    command: () => apex.createBuffer('FLT'),
    signature: ['fleet'],
  })
  palette.addCommand({
    name: 'Fleet route',
    description: 'View or plot a route for a ship in the fleet',
    command: (shipName: string) => apex.fleetOpenShipRoute(shipName),
    signature: ['fleet', 'route', PaletteCommandVariables.ShipName],
  })
  palette.addCommand({
    name: 'Fleet cargo',
    description: 'Open a the cargo of a ship in the fleet',
    command: (shipName: string) => apex.fleetOpenShipCargo(shipName),
    signature: ['fleet', 'cargo', PaletteCommandVariables.ShipName],
  })
  palette.addCommand({
    name: 'Fleet fuel',
    description: 'Open a the fuel of a ship in the fleet',
    command: (shipName: string) => apex.fleetOpenShipFuel(shipName),
    signature: ['fleet', 'fuel', PaletteCommandVariables.ShipName],
  })
  palette.addCommand({
    name: 'Fleet unload',
    description: 'Unload a ship in the fleet',
    command: (shipName: string) => apex.fleetUnloadShip(shipName),
    signature: ['fleet', 'unload', PaletteCommandVariables.ShipName],
  })

  // ############################
  // #    Inventory commands    #
  // ############################

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
    description: "Open the base's inventory",
    command: (planetName: string) => apex.openBaseInventory(planetName),
    signature: ['inventory', 'base', PaletteCommandVariables.PlanetName],
  })
  palette.addCommand({
    name: 'Ship cargo',
    description: "Open a ship's cargo",
    command: (shipName: string) => apex.invOpenShipCargo(shipName),
    signature: ['inventory', 'cargo', PaletteCommandVariables.ShipName],
  })
  palette.addCommand({
    name: 'Warehouse',
    description: 'Open a warehouse inventory',
    command: (systemName: string) => apex.openWarehouse(systemName),
    signature: ['inventory', 'warehouse', PaletteCommandVariables.Location],
  })

  // ############################
  // #     Screen commands      #
  // ############################

  palette.addCommand({
    name: 'Screen',
    description: 'Open a screen',
    command: (screen: string) =>
      apex.Screens.find(
        s => s.name.toLowerCase() === screen.toLowerCase()
      )?.open(),
    signature: ['screen', PaletteCommandVariables.Screen],
  })

  // ############################
  // #  Notification commands   #
  // ############################

  palette.addCommand({
    name: 'Notifications',
    description: 'Open the notifications list',
    command: () => apex.createBuffer('NOTS'),
    signature: ['notifications'],
  })
  palette.addCommand({
    name: 'Notifications read',
    description: 'Mark all notifications as read',
    command: () => apex.markAllNotificationsRead(),
    signature: ['notifications', 'read'],
  })
  palette.addCommand({
    name: 'Notifications seen',
    description: 'Mark all notifications as seen',
    command: () => apex.markAllNotificationsSeen(),
    signature: ['notifications', 'seen'],
  })
  palette.addCommand({
    name: 'Notifications open',
    description: 'Open a notification',
    command: (notificationId: string) =>
      apex.openNotificationIndex(Number(notificationId)),
    signature: ['notifications', 'open', PaletteCommandVariables.Number],
  })

  // ############################
  // #     Settings commands    #
  // ############################

  palette.addCommand({
    name: 'Settings',
    description: 'PrUn Palette settings',
    command: () => settingsManager.openSettings(),
    signature: ['settings'],
  })
}
