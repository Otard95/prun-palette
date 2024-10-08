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
import { a, p, El } from '../../utils/dom'
import bufferBody from '../buffer/body'
import { bufferSettings } from './buffer'
import { settingsHeader } from './header'
import { importExportSettings } from './import-export'
import { keybindsSettings } from './keybinds'

// interface SettingsProps {
// }
export default function settings() {
  let settings: El<HTMLDivElement> | undefined
  function renderSettings() {
    return bufferBody(
      { name: 'PrUn Palette Settings', command: 'prun settings' },
      p('Changes require a refresh to take effect.'),
      p(
        'Checkout the ',
        a(
          'https://otard95.github.io/prun-palette-site/#/features',
          'website'
        ).att$('target', '_blank'),
        ' for more information'
      ),
      settingsHeader({
        title: 'Key bindings',
        info: 'Learn more about keybinds at the website',
      }),
      keybindsSettings(),
      settingsHeader({ title: 'Buffer' }),
      bufferSettings(),
      settingsHeader({ title: 'Import/Export' }),
      importExportSettings({
        rerender: () => {
          settings = settings?.replace$(renderSettings())
        },
      })
    )
  }
  settings = renderSettings()

  return settings
}
