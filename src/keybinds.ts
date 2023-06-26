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
const alphabet = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
] as const

const regularKeys = [
  ...alphabet,
  'arrowup',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'tab',
  'escape',
  'enter',
  'backspace',
  'delete',
  'home',
  'end',
  'pageup',
  'pagedown',
  'space',
  'insert',
  'pause',
  'capslock',
] as const

const mods = ['control', 'alt', 'shift', 'meta'] as const

const keys = [...regularKeys, ...mods] as const

// type Letter = (typeof alphabet)[number]
type RegularKey = (typeof regularKeys)[number]
type Key = (typeof keys)[number]
type Mod = (typeof mods)[number]
type KeyGroupMod = 'C' | 'A' | 'S' | 'M'
type KeyGroup =
  | RegularKey
  | `<${KeyGroupMod}-${RegularKey}>`
  | `<${KeyGroupMod}${KeyGroupMod}-${RegularKey}>`
  | `<${KeyGroupMod}${KeyGroupMod}${KeyGroupMod}-${RegularKey}>`
  | `<${KeyGroupMod}${KeyGroupMod}${KeyGroupMod}${KeyGroupMod}-${RegularKey}>`

type KeybindCallback = (preventDefault: () => void) => Promise<void> | void
interface Keybind {
  keySequence: KeyGroup[]
  command: KeybindCallback
  preventDefault: boolean
}

export default class Keybinds {
  private keybinds: Keybind[] = []
  private heldKeys: Key[] = []
  private pressedKeys: EphemeralArray<KeyGroup> = new EphemeralArray(1000)

  constructor(element: HTMLElement | Document | Window = window) {
    element.addEventListener('keydown', event => {
      if (event instanceof KeyboardEvent) this.handleKeyDown(event)
    })

    element.addEventListener('keyup', event => {
      if (event instanceof KeyboardEvent) this.handleKeyUp(event)
    })

    this.pressedKeys.onTimeout(this.handlePressedOnTimeout.bind(this))
  }

  private isKeyGroup(keyStr: string): keyStr is KeyGroup {
    if (regularKeys.includes(keyStr as RegularKey)) return true

    if (!/<(C|A|S|M){1,4}-\w+>/.test(keyStr)) return false

    const [, modifiers, key] = keyStr.match(/<([CASM]+)-(\w+)>/) as [
      string,
      string,
      RegularKey
    ]

    const mods = modifiers.split('')
    return (
      regularKeys.includes(key as RegularKey) &&
      mods.every(m => ['C', 'A', 'S', 'M'].includes(m))
    )
  }

  private parseBind(bind: string): KeyGroup[] {
    const keys = bind.trim().split(/\s+/)
    if (keys.some(key => !this.isKeyGroup(key)))
      throw new Error(`Invalid keybind: ${bind}`)

    return keys as KeyGroup[]
  }

  public addKeybind(
    bind: string,
    command: KeybindCallback,
    { preventDefault = true } = {}
  ) {
    const keySequence = this.parseBind(bind)

    if (this.hasKeybind(bind))
      throw new Error(`Keybind already exists: ${bind}`)

    this.keybinds.push({
      keySequence,
      command,
      preventDefault,
    })
  }

  public removeKeybind(bind: string) {
    const keySequence = this.parseBind(bind)
    this.keybinds = this.keybinds.filter(keybind => {
      return !arrayEqual(keybind.keySequence, keySequence)
    })
  }

  public hasKeybind(bind: string) {
    const keySequence = this.parseBind(bind)
    return this.keybinds.some(keybind =>
      arrayEqual(keybind.keySequence, keySequence)
    )
  }

  private isModifier(key: Key): key is Mod {
    return mods.includes(key as Mod)
  }

  private isRegularKey(key: Key): key is RegularKey {
    return regularKeys.includes(key as RegularKey)
  }

  private modToKeyGroupMod(mod: Mod): string {
    switch (mod) {
      case 'control':
        return 'C'
      case 'alt':
        return 'A'
      case 'shift':
        return 'S'
      case 'meta':
        return 'M'
    }
  }

  private keyGroupFromHeldKeys(): KeyGroup | null {
    if (this.heldKeys.length === 0) return null
    if (this.heldKeys.length === 1 && this.isRegularKey(this.heldKeys[0]))
      return this.heldKeys[0]

    const modifiers = this.heldKeys.filter(this.isModifier)
    const keys = this.heldKeys.filter(this.isRegularKey)

    if (keys.length === 0 || keys.length > 1) return null

    const keyGroupMods = modifiers.map(this.modToKeyGroupMod).join('')

    return `<${keyGroupMods}-${keys[0]}>` as KeyGroup
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase() as RegularKey
    if (!keys.includes(key)) return

    console.debug(`[PrUn Palette](Keybinds) ↓${key}`)

    this.heldKeys.push(key)

    const keyGroup = this.keyGroupFromHeldKeys()
    if (keyGroup !== null && keyGroup.includes('<')) {
      // If a modifier key and a regular key is pressed already, we can
      // assume that the user is trying to press a keybind that includes the
      // modifier. For example, if the user presses `shift` while holding `a`,
      // we can assume that they want to press `shift-a`, and not `shift`, and
      // that they don't need any other modifiers.
      this.pressedKeys.push(keyGroup)
      this.handleKeyPressed(event)
      this.heldKeys = []
    }
  }

  private handleKeyUp(event: KeyboardEvent) {
    const key = event.key.toLowerCase() as RegularKey
    if (!keys.includes(key)) return

    console.debug(`[PrUn Palette](Keybinds) ↑${key}`)

    const keyGroup = this.keyGroupFromHeldKeys()
    if (keyGroup !== null) {
      this.pressedKeys.push(keyGroup)
      this.handleKeyPressed(event)
      this.heldKeys = []
    }

    this.heldKeys = this.heldKeys.filter(k => k !== key)
  }

  private handleKeyPressed(event: KeyboardEvent) {
    console.debug('[PrUn Palette](Keybinds) handleKeyPressed', { event })

    // Find any keybinds that match the current key presses, including those
    // that could become matching.
    const matchingKeybinds = this.keybinds.filter(keybind => {
      return arrayStartsWith(keybind.keySequence, this.pressedKeys)
    })

    console.debug(
      '[PrUn Palette](Keybinds) matching keybinds',
      matchingKeybinds
    )

    // If there are no matches we cant do anything
    if (matchingKeybinds.length === 0) return

    // If there are more than one we can't make a decision yet on which is
    // correct.
    if (matchingKeybinds.length > 1) {
      console.debug(
        '[PrUn Palette](Keybinds) multiple matching keybinds, waiting for more input'
      )
      return
    }

    // If there is only one match make sure its exact
    const match = this.keybinds.find(keybind =>
      arrayEqual(keybind.keySequence, this.pressedKeys)
    )

    console.debug('[PrUn Palette](Keybinds) exact match', match)

    if (!match) return

    if (match.preventDefault) event.preventDefault()

    match.command(() => event.preventDefault())
    this.pressedKeys.length = 0
  }

  private handlePressedOnTimeout() {
    // Find keybinds that exactly match the current keypresses
    this.keybinds
      .find(keybind => arrayEqual(keybind.keySequence, this.pressedKeys))
      ?.command(() => {
        return
      })
  }
}
