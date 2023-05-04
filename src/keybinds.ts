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
import EphemeralArray from './utils/ephemeral-array'
import { arrayEqual, arrayStartsWith } from './utils/array'

// all lovercase letters
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'] as const

const keys = [...alphabet, 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'tab', 'escape', 'enter', 'backspace'] as const

type Letter = typeof alphabet[number]
type Key = typeof keys[number]
type KeyGroup = Key | `<C-${Key}>` | `<A-${Key}>` | `<S-${Key}>`

type KeybindCallback = (preventDefault: () => void) => void
interface Keybind {
  keySequence: KeyGroup[]
  command: KeybindCallback
  preventDefault: boolean
}

export default class Keybinds {
  private keybinds: Keybind[] = []
  private pressedKeys: EphemeralArray<KeyGroup> = new EphemeralArray(1000)

  constructor(element: HTMLElement | Document = document.body) {
    element.addEventListener('keydown', (event) => {
      if (event instanceof KeyboardEvent)
        this.handleKeyDown(event)
    })

    this.pressedKeys.onTimeout(this.handlePressedOnTimeout.bind(this))
  }

  private isKey(keyStr: string): keyStr is KeyGroup {
    if (keys.includes(keyStr as Key)) return true

    if (!/<(C|A|S){1,3}-\w+>/.test(keyStr)) return false

    const [, modifiers, key] = keyStr.match(/<([CAS]+)-(\w+)>/) as [string, string, Key]

    const mods = modifiers.split('')
    return keys.includes(key as Key) && mods.every(m => ['C', 'A', 'S'].includes(m))
  }

  private parseBind(bind: string): KeyGroup[] {
    const keys = bind.trim().split(/\s+/)
    if (keys.some((key) => !this.isKey(key))) throw new Error(`Invalid keybind: ${bind}`)

    return keys as KeyGroup[]
  }

  public addKeybind(bind: string, command: KeybindCallback, { preventDefault = true } = {}) {
    const keySequence = this.parseBind(bind)

    if (this.keybinds.some(keybind => arrayEqual(keybind.keySequence, keySequence)))
      throw new Error(`Keybind already exists: ${bind}`)

    this.keybinds.push({
      keySequence,
      command,
      preventDefault,
    })
  }

  public removeKeybind(bind: string) {
    const keySequence = this.parseBind(bind)
    this.keybinds = this.keybinds.filter((keybind) => {
      return !arrayEqual(keybind.keySequence, keySequence)
    })
  }

  private keyFromKeyboardEvent(event: KeyboardEvent): KeyGroup | null {
    const { key, ctrlKey, altKey, shiftKey } = event

    if (!keys.includes(key.toLowerCase() as Key)) return null

    if (!ctrlKey && !altKey && !shiftKey) return key.toLowerCase() as Key

    const modifiers = [
      ctrlKey ? 'C' : '',
      altKey ? 'A' : '',
      shiftKey ? 'S' : '',
    ].join('')

    return `<${modifiers}-${key.toLowerCase()}>` as KeyGroup
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = this.keyFromKeyboardEvent(event)
    if (key === null) return

    this.pressedKeys.push(key)

    // Find any keybinds that match the current key presses, including those
    // that could become matching.
    const matchingKeybinds = this.keybinds.filter((keybind) => {
      return arrayStartsWith(keybind.keySequence, this.pressedKeys)
    })

    // If there are no matches we cant do anything
    if (matchingKeybinds.length === 0) return

    // If there are more than one we can't make a decision yet on which is
    // correct.
    if (matchingKeybinds.length > 1) {
      event.preventDefault()
      return
    }

    // If there is only one match make sure its exact
    const match = this.keybinds
      .find(keybind => arrayEqual(keybind.keySequence, this.pressedKeys))

    if (!match) return

    if (match.preventDefault) event.preventDefault()

    match.command(() => event.preventDefault())
    this.pressedKeys.length = 0
  }

  private handlePressedOnTimeout() {
    // Find keybinds that exactly match the current keypresses
    this.keybinds.find(
      (keybind) => arrayEqual(keybind.keySequence, this.pressedKeys)
    )?.command(() => {})
  }
}


