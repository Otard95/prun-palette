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
import { h3, span } from '../../utils/dom'

interface SettingsHeaderProps {
  title: string
}
export const settingsHeader = ({ title }: SettingsHeaderProps) => {
  return h3(
    title,
    span('ⓘ')
      .att$('data-tooltip', 'Learn more about keybinds at the website')
      .att$('data-tooltip-position', 'right')
  ).att$(
    'class',
    'Sidebar__sectionHead____NHLKDT fonts__font-regular___Sxp1xjo'
  )
}
