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
import { HasType } from 'utility-types'
import { CustomKeybind, KeybindAction } from '../../../settings/types'
import { div, td, tr } from '../../../utils/dom'
import { removeButton } from '../../elements/buttons'

interface KeybindProps {
  customKeybind: CustomKeybind
  remove: () => void
}
export function keybind({ customKeybind, remove }: KeybindProps) {
  switch (customKeybind.action) {
    case KeybindAction.Buffer:
      return keybindBuffer({ customKeybind, remove })
    case KeybindAction.Palette:
      return keybindPaletteCommand({ customKeybind, remove })
    default:
      customKeybind.action as HasType<never, typeof customKeybind.action>
      return div('Unknown keybind action')
  }
}

interface KeybindBufferProps {
  customKeybind: CustomKeybind
  remove: () => void
}
function keybindBuffer({ customKeybind, remove }: KeybindBufferProps) {
  return tr(
    td(customKeybind.keySequence),
    customKeybind.arg
      ? td(`Open buffer with command: ${customKeybind.arg}`)
      : td(`Open empty buffer`),
    td(removeButton(remove))
  )
}
interface KeybindPaletteProps {
  customKeybind: CustomKeybind
  remove: () => void
}
function keybindPaletteCommand({ customKeybind, remove }: KeybindPaletteProps) {
  return tr(
    td(customKeybind.keySequence),
    td(`Run palette command: ${customKeybind.arg}`),
    td(removeButton(remove))
  )
}
