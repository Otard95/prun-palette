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
import Apex from './apex'
import attachCommands from './commands'
import Keybinds from './keybinds'
import Palette from './palette'
import { SettingsManager } from './settings'
import { settingsStore } from './settings/settings-store'
import { KeybindAction } from './settings/types'

async function init() {
  console.debug('[PrUn Palette] Initializing...')

  const apex = new Apex()
  const keybinds = new Keybinds()
  const palette = new Palette(apex)
  const settingsManager = new SettingsManager(apex.createBuffer.bind(apex))

  attachCommands(palette, apex, settingsManager)

  await apex.ready

  keybinds.addKeybind('<C-p>', () => palette.toggle())
  keybinds.addKeybind(
    '<esc>',
    preventDefault => {
      if (palette.Open) preventDefault()
      palette.close()
    },
    { preventDefault: false }
  )

  settingsStore.State.keybinds?.forEach(keybind => {
    keybinds.addKeybind(keybind.keySequence, () => {
      switch (keybind.action) {
        case KeybindAction.Buffer:
          apex.createBuffer(keybind.arg)
          break
        default:
          keybind.action as HasType<never, typeof keybind.action>
      }
    })
  })

  console.debug('[PrUn Palette] Ready!')
}
init()
