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
import './create.sass'
import { AddKeybindFn } from '.'
import {
  div,
  h3,
  option,
  select,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from '../../../utils/dom'
import { addButton } from '../../elements/buttons'
import { isKeybindAction, KeybindAction } from '../../../settings/types'
import { textInput } from '../../elements/text-input'
import { HasType } from 'utility-types'

interface CreateKeybindProps {
  add: AddKeybindFn
}
export function createKeybind({ add }: CreateKeybindProps) {
  const selector = select(option(KeybindAction.Buffer, 'Create buffer')).att$(
    'class',
    'prun-palette prun-select'
  )

  if (!isKeybindAction(selector.value)) throw new Error('Invalid action')
  let additionalInputs = createAdditionalInputs(selector.value)

  selector.onChange$(() => {
    if (!isKeybindAction(selector.value)) throw new Error('Invalid action')
    additionalInputs = additionalInputs.replace$(
      createAdditionalInputs(selector.value)
    )
  })

  const keySequenceInput = textInput('').att$('placeholder', 'Key sequence')

  return div(
    h3('Create keybind'),
    table(
      thead(th('Action'), th('Arguments'), th('Key sequence'), th('')),
      tbody(
        tr(
          td(selector),
          td(additionalInputs),
          td(keySequenceInput),
          td(
            addButton(() => {
              const action = selector.value
              const args = Array.from(
                additionalInputs.querySelectorAll('input')
              )
                .map(input => input.value)
                .join(' ')
              const keySequence = keySequenceInput.value
              add(action as KeybindAction, args, keySequence)
            })
          )
        )
      )
    )
  )
}

function createAdditionalInputs(action: KeybindAction) {
  switch (action) {
    case KeybindAction.Buffer:
      return createBufferInputs()
    default:
      action as HasType<never, typeof action>
      return div('Unknown keybind action')
  }
}

function createBufferInputs() {
  return div(textInput('').att$('placeholder', 'Buffer command'))
}
