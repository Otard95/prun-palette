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
import { settingsStore } from '../../../settings/settings-store'
import { div, p } from '../../../utils/dom'
import { checkboxButton } from '../../elements/checkbox-button'
import { fromLine } from '../../elements/form'

export function bufferSettings() {
  return div(
    p('Experimental feature'),
    fromLine({ label: 'Remember buffer size', input: rememberSize() }),
    fromLine({ label: 'Remember buffer position', input: rememberPosition() })
  )
}

function rememberSize() {
  return checkboxButton({
    checked: settingsStore.get('rememberBufferSize') ?? false,
    label: 'Remember',
    onChange: () => {
      settingsStore.set(
        'rememberBufferSize',
        !settingsStore.get('rememberBufferSize')
      )
    },
  })
}

function rememberPosition() {
  return checkboxButton({
    checked: settingsStore.get('rememberBufferPosition') ?? false,
    label: 'Remember',
    onChange: () => {
      settingsStore.set(
        'rememberBufferPosition',
        !settingsStore.get('rememberBufferPosition')
      )
    },
  })
}
