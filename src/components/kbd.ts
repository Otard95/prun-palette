import './kbd.sass'
import { Children, tag } from '../utils/dom'

export default function kbd(...children: Children) {
  return tag('kbd', ...children)
}

