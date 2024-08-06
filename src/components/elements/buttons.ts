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

export function removeButton(remove: () => void) {
  return button('REMOVE')
    .att$('class', 'Button__btn___UJGZ1b7 Button__danger___S2rSOES')
    .onClick$(remove)
}

export function addButton(add: () => void) {
  return button('ADD')
    .att$('class', 'Button__primary____lObPiw Button__btn___UJGZ1b7')
    .onClick$(add)
}
