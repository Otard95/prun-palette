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
import { button } from '../../utils/dom'

export enum ButtonType {
  Primary = 'Button__primary____lObPiw Button__btn___UJGZ1b7',
  Danger = 'Button__btn___UJGZ1b7 Button__danger___S2rSOES',
}
export function apexButton(
  type: ButtonType,
  text: string,
  onClick: () => void
) {
  return button(text).att$('class', type).onClick$(onClick)
}

export function removeButton(remove: () => void) {
  return apexButton(ButtonType.Danger, 'REMOVE', remove)
}

export function addButton(add: () => void) {
  return apexButton(ButtonType.Primary, 'ADD', add)
}
