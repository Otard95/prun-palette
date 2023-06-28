import './form.sass'
import { Child, div } from '../../utils/dom'

interface FormLineProps {
  label: string
  input: Child
}
export function fromLine({ label, input }: FormLineProps) {
  return div(
    div(label).att$('class', 'prun-palette prun-form-label'),
    div(input).att$('class', 'prun-palette prun-form-input')
  ).att$('class', 'prun-palette prun-form-line')
}
