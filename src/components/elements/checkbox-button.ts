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
