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
import { settingsStore } from '../../../settings/settings-store'
import { CustomKeybind, KeybindAction } from '../../../settings/types'
import { div, table, tbody, th, thead } from '../../../utils/dom'
import { createKeybind } from './create'
import { keybind } from './listItem'

export const keybindsSettings = () => {
  let keybindSettings = createKeybindSettings(
    settingsStore.State.keybinds || []
  )
  settingsStore.subscribe('keybinds', keybinds => {
    if (Array.isArray(keybinds))
      keybindSettings = keybindSettings.replace$(
        createKeybindSettings(keybinds)
      )
  })
  return keybindSettings
}

export type AddKeybindFn = (
  action: KeybindAction,
  arg: string,
  keySequence: string
) => void
function createKeybindSettings(keybinds: CustomKeybind[]) {
  const remove = (keybind: CustomKeybind) => {
    return () => {
      settingsStore.set(
        'keybinds',
        settingsStore.State.keybinds?.filter(kb => kb !== keybind)
      )
    }
  }
  const add: AddKeybindFn = (action, arg, keySequence) => {
    settingsStore.set(
      'keybinds',
      settingsStore.State.keybinds?.concat({
        v: 1,
        action,
        arg,
        keySequence,
      })
    )
  }

  return div(
    table(
      thead(th('Keyboard shortcut'), th('Action'), th('')),
      tbody(
        keybinds.length === 0 && th('No keybinds'),
        ...keybinds.map(k =>
          keybind({
            customKeybind: k,
            remove: remove(k),
          })
        )
      )
    ),
    createKeybind({ add })
  )
}
