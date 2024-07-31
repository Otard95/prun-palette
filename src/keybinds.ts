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
/* eslint-disable @typescript-eslint/no-empty-function */
import { isEmpty } from './utils/object'

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

const symbols = [
  '+',
  '-',
  '*',
  '/',
  '=',
  '%',
  '&',
  '|',
  '^',
  '~',
  '!',
  '?',
  ':',
  '#',
  '@',
  '$',
] as const

const eventKeyToKeyNotation: Record<string, KeyNotation> = {
  arrowup: '<up>',
  arrowdown: '<down>',
  arrowleft: '<left>',
  arrowright: '<right>',
  tab: '<tab>',
  escape: '<esc>',
  enter: '<cr>',
  backspace: '<bs>',
  delete: '<del>',
  home: '<home>',
  end: '<end>',
  pageup: '<pageup>',
  pagedown: '<pagedown>',
  space: '<space>',
  insert: '<insert>',
  '<': '<lt>',
  '>': '<gt>',
}

const keyNotationSpecialKeys = [
  '<up>',
  '<down>',
  '<left>',
  '<right>',
  '<tab>',
  '<esc>',
  '<enter>',
  '<return>',
  '<cr>',
  '<bs>',
  '<del>',
  '<home>',
  '<end>',
  '<pageup>',
  '<pagedown>',
  '<space>',
  '<insert>',
  '<lt>',
  '<gt>',
] as const

type Letter = (typeof alphabet)[number]
type SymbolKey = (typeof symbols)[number]
type SpecialKey = (typeof keyNotationSpecialKeys)[number]
type Key = Letter | SymbolKey | SpecialKey
type KeyNotationMod = 'C' | 'A' | 'S' | 'M'
type KeyNotation =
  | Key
  | `<${KeyNotationMod}-${Key}>`
  | `<${KeyNotationMod}${KeyNotationMod}-${Key}>`
  | `<${KeyNotationMod}${KeyNotationMod}${KeyNotationMod}-${Key}>`
  | `<${KeyNotationMod}${KeyNotationMod}${KeyNotationMod}${KeyNotationMod}-${Key}>`

type KeybindCallback = (preventDefault: () => void) => Promise<void> | void
interface Keybind {
  command: KeybindCallback
  preventDefault: boolean
}

interface KeybindTreeNode {
  key?: KeyNotation
  parent?: KeybindTreeNode
  action?: Keybind
  children: Record<string, KeybindTreeNode>
}

export default class Keybinds {
  private keybindTreeRoot: KeybindTreeNode = { children: {} }
  private keybindTreeCurrent = this.keybindTreeRoot
  private executeActionTimeout?: number

  constructor(element: HTMLElement | Document | Window = window) {
    element.addEventListener('keydown', event => {
      if (event instanceof KeyboardEvent) this.handleKeyDown(event)
    })
  }

  get CurrentKeySequence() {
    let seq = ''
    let node = this.keybindTreeCurrent
    while (node.parent) {
      seq = `${node.key || ''}${seq}`
      node = node.parent
    }
    return seq
  }

  private isSingleKeyNotation(notation: string): notation is Key {
    if (alphabet.includes(notation.toLowerCase() as Letter)) return true
    if (symbols.includes(notation as SymbolKey)) return true
    if (
      /^<\w+>$/.test(notation) &&
      keyNotationSpecialKeys.includes(notation.toLowerCase() as SpecialKey)
    )
      return true

    return false
  }

  private isKeyNotation(keyStr: string): keyStr is KeyNotation {
    if (this.isSingleKeyNotation(keyStr)) return true

    if (!/<(C|A|S|M){1,4}-[^><]+>/i.test(keyStr)) return false

    const [, modifiers, key] = keyStr.match(/<([CASM]+)-([^><]+)>/i) as [
      string,
      string,
      Key
    ]

    const mods = modifiers.split('')
    const modsAreValid = mods.every(m =>
      ['c', 'a', 's', 'm'].includes(m.toLowerCase())
    )
    const keyIsValid = this.isKeyNotation(key) || this.isKeyNotation(`<${key}>`)
    return modsAreValid && keyIsValid
  }

  private parseBind(bind: string): KeyNotation[] {
    const keys: KeyNotation[] = []
    let buf = ''

    const chars = bind.split('')
    while (chars.length) {
      const char = chars.shift()
      if (char === undefined) break
      if (char === '>') {
        buf += char
        if (this.isKeyNotation(buf)) {
          keys.push(buf)
          buf = ''
        } else {
          throw new Error(`Invalid key notation: ${buf}`)
        }
      } else if (buf.length || char === '<') {
        buf += char
      } else if (this.isKeyNotation(char)) {
        keys.push(char)
      } else {
        throw new Error(`Invalid key notation: ${char}`)
      }
    }

    if (buf) throw new Error(`Incomplete key notation: ${buf}`)

    if (!keys.length) {
      throw new Error('Key notation was empty')
    }

    return keys
  }

  public addKeybind(
    bind: string,
    command: KeybindCallback,
    { preventDefault = true } = {}
  ) {
    const keySequence = this.parseBind(bind)

    let node = this.keybindTreeRoot
    keySequence.forEach(keyGroup => {
      if (!(keyGroup in node.children)) {
        node.children[keyGroup] = { parent: node, key: keyGroup, children: {} }
      }
      node = node.children[keyGroup]
    })

    if (node.action) throw new Error(`Keybind already exists: ${bind}`)

    node.action = {
      command,
      preventDefault,
    }

    console.debug(
      `[PrUn Palette](Keybinds) New keybind tree`,
      this.keybindTreeRoot
    )
  }

  public removeKeybind(bind: string) {
    const keySequence = this.parseBind(bind)

    let node = this.keybindTreeRoot
    keySequence.forEach(keyGroup => {
      if (!(keyGroup in node.children)) {
        throw new Error(`Keybind does not exist: ${bind}`)
      }
      node = node.children[keyGroup]
    })

    delete node.action
    this.cleanKeybindTree(this.keybindTreeRoot)

    console.debug(
      `[PrUn Palette](Keybinds) New keybind tree`,
      this.keybindTreeRoot
    )
  }

  private cleanKeybindTree(node: KeybindTreeNode) {
    Object.getOwnPropertyNames(node.children).forEach(key =>
      this.cleanKeybindTree(node.children[key])
    )

    if (node.key && node.parent && !node.action && isEmpty(node.children)) {
      node.parent.children[node.key]
    }
  }

  private createKeyGroupFromKeyboardEvent(
    event: KeyboardEvent
  ): KeyNotation | null {
    let key = ''

    if (event.key.toLowerCase() in eventKeyToKeyNotation)
      return eventKeyToKeyNotation[event.key.toLowerCase()]

    if (symbols.includes(event.key as SymbolKey)) {
      key = event.key
    } else if (
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.metaKey
    ) {
      key = `<${event.ctrlKey ? 'C' : ''}${event.shiftKey ? 'S' : ''}${
        event.altKey ? 'A' : ''
      }${event.metaKey ? 'M' : ''}-${event.key.toLowerCase()}>`
    } else {
      key = event.key.toLowerCase()
    }

    if (!this.isKeyNotation(key)) return null

    return key
  }

  private handleKeyDown(event: KeyboardEvent) {
    const keyNotation = this.createKeyGroupFromKeyboardEvent(event)

    console.debug(
      `[PrUn Palette](Keybinds) Key down: ↓${event.key} | notation: ${keyNotation} | event:`,
      event
    )

    if (keyNotation === null) return

    console.debug(
      `[PrUn Palette](Keybinds) Recognised key notation: ${keyNotation}`
    )

    const hadWaitingCommand = this.executeActionTimeout !== undefined
    clearTimeout(this.executeActionTimeout)
    this.executeActionTimeout = undefined

    if (!(keyNotation in this.keybindTreeCurrent.children)) {
      if (hadWaitingCommand && event.key !== 'escape') {
        this.keybindTreeCurrent.action?.command(() => {})
      }

      this.keybindTreeCurrent = this.keybindTreeRoot
      return
    }

    this.keybindTreeCurrent = this.keybindTreeCurrent.children[keyNotation]
    console.debug(
      `[PrUn Palette](Keybinds) Current key sequence: ${this.CurrentKeySequence}`
    )

    if (
      isEmpty(this.keybindTreeCurrent.children) &&
      this.keybindTreeCurrent.action
    ) {
      if (this.keybindTreeCurrent.action.preventDefault) {
        event.preventDefault()
      }
      this.keybindTreeCurrent.action.command(() => event.preventDefault())
      this.keybindTreeCurrent = this.keybindTreeRoot
      return
    }

    if (this.keybindTreeCurrent.action) {
      this.executeActionTimeout = setTimeout(() => {
        this.keybindTreeCurrent.action?.command(() => {})
        this.keybindTreeCurrent = this.keybindTreeRoot
        this.executeActionTimeout = undefined
      }, 500)
    }
  }
}
