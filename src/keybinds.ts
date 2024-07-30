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
import { HasType } from 'utility-types'
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

interface KeybindTreeNode {
  key?: KeyGroup
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

    let node = this.keybindTreeRoot
    keySequence.forEach(keyGroup => {
      if (!(keyGroup in node.children)) {
        node.children[keyGroup] = { parent: node, key: keyGroup, children: {} }
      }
      node = node.children[keyGroup]
    })

    if (node.action) throw new Error(`Keybind already exists: ${bind}`)

    node.action = {
      keySequence,
      command,
      preventDefault,
    }
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
  }

  private cleanKeybindTree(node: KeybindTreeNode) {
    Object.getOwnPropertyNames(node.children).forEach(key =>
      this.cleanKeybindTree(node.children[key])
    )

    if (node.key && node.parent && !node.action && isEmpty(node.children)) {
      node.parent.children[node.key]
    }
  }

  private createKeyGroupFromKeyboardEvent(event: KeyboardEvent): KeyGroup {
    let key = ''
    if (event.ctrlKey || event.shiftKey || event.altKey || event.metaKey) {
      key = `<${event.ctrlKey ? 'C' : ''}${event.shiftKey ? 'S' : ''}${
        event.altKey ? 'A' : ''
      }${event.metaKey ? 'M' : ''}-${event.key.toLowerCase()}>`
    } else {
      key = event.key.toLowerCase()
    }

    if (!this.isKeyGroup(key))
      throw new Error(
        `Failed to create keygroup from keyboar event: ${event.key}`
      )
    return key
  }

  private handleKeyDown(event: KeyboardEvent) {
    const key = event.key.toLowerCase() as RegularKey
    if (!regularKeys.includes(key)) return

    console.debug(`[PrUn Palette](Keybinds) ↓${key}`)

    const keyGroup = this.createKeyGroupFromKeyboardEvent(event)

    const hadWaitingCommand = this.executeActionTimeout !== undefined
    clearTimeout(this.executeActionTimeout)
    this.executeActionTimeout = undefined

    if (!(keyGroup in this.keybindTreeCurrent.children)) {
      if (hadWaitingCommand && event.key !== 'escape') {
        this.keybindTreeCurrent.action?.command(() => {})
      }

      this.keybindTreeCurrent = this.keybindTreeRoot
      return
    }

    this.keybindTreeCurrent = this.keybindTreeCurrent.children[keyGroup]

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
