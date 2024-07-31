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
import './checkbox-button.sass'

import { div, label } from '../../utils/dom'

interface CheckboxButtonProps {
  checked: boolean
  label: string
  onChange: (checked: boolean) => void
}

export function checkboxButton({
  checked,
  label: labelText,
  onChange,
}: CheckboxButtonProps) {
  const labelElement = label(labelText)
  let state = checked

  const button = div(labelElement)
    .att$('class', `prun-palette prun-checkbox${state ? ' prun-checked' : ''}`)
    .onClick$(() => {
      button.classList.toggle('prun-checked')
      state = !state
      onChange(state)
    })

  return button
}
