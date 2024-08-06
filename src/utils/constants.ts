/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2024  Stian Myklebostad

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
export enum BufferSelector {
  EmptyBuffer = '#TOUR_TARGET_EMPTY_BUFFER',
  EmptyBufferNotTaken = '#TOUR_TARGET_EMPTY_BUFFER:not(.prun-palette.prun-taken)',
  EmptyTile = '#TOUR_TARGET_EMPTY_TILE',
  NewBufferButton = '#TOUR_TARGET_BUTTON_BUFFER_NEW',
  BufferCMDElement = 'div[class^="TileFrame__cmd"]',
  TakenClass = 'prun-palette.prun-taken',
  Body = 'div[class^="Window__body"]',
  Selector = 'div[class^="Tile__selector"]',
}

export enum FleetSelector {
  FleetButtons = 'div[class^="Fleet__buttons"]',
}

export enum NotificationElementSelector {
  AlertListItem = 'div[class^="AlertListItem__container"]',
  AlertListItemContent = 'div[class^="AlertListItem__content"]',
}
