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
  '[',
  ']',
  '{',
  '}',
  '(',
  ')',
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
  ' ': '<space>',
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

  public addKeybind(
    bind: string,
    command: KeybindCallback,
    { preventDefault = true } = {}
  ) {
    const keySequence = this.parseBind(bind)

    let node = this.keybindTreeRoot
    keySequence.forEach(keyNotation => {
      if (!(keyNotation in node.children)) {
        node.children[keyNotation] = {
          parent: node,
          key: keyNotation,
          children: {},
        }
      }
      node = node.children[keyNotation]
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
    keySequence.forEach(keyNotation => {
      if (!(keyNotation in node.children)) {
        throw new Error(`Keybind does not exist: ${bind}`)
      }
      node = node.children[keyNotation]
    })

    delete node.action
    this.cleanKeybindTree(this.keybindTreeRoot)

    console.debug(
      `[PrUn Palette](Keybinds) New keybind tree`,
      this.keybindTreeRoot
    )
  }

  public clearAll() {
    this.keybindTreeRoot.children = {}
    this.keybindTreeCurrent = this.keybindTreeRoot
  }

  private cleanKeybindTree(node: KeybindTreeNode) {
    Object.getOwnPropertyNames(node.children).forEach(key =>
      this.cleanKeybindTree(node.children[key])
    )

    if (node.key && node.parent && !node.action && isEmpty(node.children)) {
      delete node.parent.children[node.key]
    }
  }

  private isSingleKeyNotation(
    notation: string
  ): notation is Letter | SymbolKey {
    return (
      alphabet.includes(notation.toLowerCase() as Letter) ||
      symbols.includes(notation as SymbolKey)
    )
  }

  private isSpecialKeyNotation(notation: string): notation is SpecialKey {
    return (
      /^<[a-zA-Z]+>$/.test(notation) &&
      keyNotationSpecialKeys.includes(notation.toLowerCase() as SpecialKey)
    )
  }

  private isModifiedKeyNotation(notation: string): boolean {
    if (!/<(C|A|S|M){1,4}-[^><]+>/i.test(notation)) return false

    const [, modifiers, key] = notation.match(/<([CASM]+)-([^><]+)>/i) as [
      string,
      string,
      Key
    ]

    const mods = modifiers.split('')
    const modsAreValid = mods.every(m =>
      ['c', 'a', 's', 'm'].includes(m.toLowerCase())
    )
    const keyIsValid =
      this.isSingleKeyNotation(key) || this.isSpecialKeyNotation(`<${key}>`)
    return modsAreValid && keyIsValid
  }

  private isKeyNotation(notation: string): notation is KeyNotation {
    return (
      this.isSingleKeyNotation(notation) ||
      this.isSpecialKeyNotation(notation) ||
      this.isModifiedKeyNotation(notation)
    )
  }

  private normalizeKeyNotation(notation: KeyNotation): KeyNotation {
    if (this.isSingleKeyNotation(notation)) return notation

    if (this.isSpecialKeyNotation(notation))
      return notation.toLowerCase() as KeyNotation

    const [, modifiers, key] = notation.match(/<([CASM]+)-([^><]+)>/i) as [
      string,
      string,
      Key
    ]

    const mods = modifiers.split('')
    const orderedMods: string[] = []
    mods.forEach(m => {
      switch (m.toLowerCase()) {
        case 'c':
          orderedMods[0] = 'C'
          break
        case 's':
          orderedMods[1] = 'S'
          break
        case 'a':
          orderedMods[2] = 'A'
          break
        case 'm':
          orderedMods[3] = 'M'
          break
      }
    })

    if (
      alphabet.includes(key.toLowerCase() as Letter) &&
      orderedMods[1] === 'S' &&
      orderedMods.filter(Boolean).length === 1
    ) {
      return key.toUpperCase() as Letter
    }
    if (
      alphabet.includes(key.toLowerCase() as Letter) &&
      key.toUpperCase() === key
    ) {
      orderedMods[1] = 'S'
    }

    if (symbols.includes(key as SymbolKey) && orderedMods.length > 1)
      throw new Error('Symbold keys can only have ctrl modifier')

    return `<${orderedMods.join('')}-${
      this.isSingleKeyNotation(key)
        ? orderedMods[1] === 'S'
          ? key.toUpperCase()
          : key.toLowerCase()
        : key.toLowerCase()
    }>` as KeyNotation
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
          keys.push(this.normalizeKeyNotation(buf))
          buf = ''
        } else {
          throw new Error(`Invalid key notation: ${buf}`)
        }
      } else if (buf.length || char === '<') {
        buf += char
      } else if (this.isKeyNotation(char)) {
        keys.push(char as KeyNotation)
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

  private isEventOnlyCtrl(event: KeyboardEvent): boolean {
    return event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey
  }

  private isEventOnlyShift(event: KeyboardEvent): boolean {
    return event.shiftKey && !event.ctrlKey && !event.altKey && !event.metaKey
  }

  private shouldMakeModKeyNotationOfEvent(event: KeyboardEvent): boolean {
    // SymbolKey's can only get mod key notation by ctrl
    if (symbols.includes(event.key as SymbolKey))
      return this.isEventOnlyCtrl(event)

    // Shifted alpha keys should only get mod key notation if other mods are pressed
    if (
      alphabet.includes(event.key.toLowerCase() as Letter) &&
      event.key.toUpperCase() === event.key
    )
      return !this.isEventOnlyShift(event)

    // lt and gt should not get mod key notation if only shift is pressed
    if (event.key === '<' || event.key === '>')
      return !this.isEventOnlyShift(event)

    // Otherwise any modifier should result in a mod key notation

    return event.ctrlKey || event.shiftKey || event.altKey || event.metaKey
  }

  private createKeyNotationFromKeyboardEvent(
    event: KeyboardEvent
  ): KeyNotation | null {
    let key = event.key

    if (event.key.toLowerCase() in eventKeyToKeyNotation)
      key = eventKeyToKeyNotation[event.key.toLowerCase()]
    else if (event.key.length > 1) {
      console.debug(
        '[PrUn Palette](Keybinds) Unhandled special key:',
        event.key
      )
      return null
    }

    if (this.shouldMakeModKeyNotationOfEvent(event)) {
      key = `<${event.ctrlKey ? 'C' : ''}${event.shiftKey ? 'S' : ''}${
        event.altKey ? 'A' : ''
      }${event.metaKey ? 'M' : ''}-${
        this.isSpecialKeyNotation(key) ? key.slice(1, -1).toLowerCase() : key
      }>`
    }

    if (!this.isKeyNotation(key)) return null

    return key as KeyNotation
  }

  private handleKeyDown(event: KeyboardEvent) {
    const keyNotation = this.createKeyNotationFromKeyboardEvent(event)

    console.debug(
      `[PrUn Palette](Keybinds) Key down: ↓${event.key} | notation: ${keyNotation} | event:`,
      event
    )

    if (keyNotation === null) return

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
