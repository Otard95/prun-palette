import Apex from './apex'
import palette from './components/palette'
import { matchArrays } from './utils/array'
import { El } from './utils/dom'
import { fuzzStrings } from './utils/fuzz'
import { memoize } from './utils/memoize'

export enum PaletteCommandVariables {
  PlanetName = '{planet-name}',
  PlanedId = '{planet-id}',
  Screen = '{screen}',
  Command = '{command}',
}
type CommandSignature = (string | PaletteCommandVariables)[]

const isPaletteCommandVariable = (value: unknown): value is PaletteCommandVariables => {
  return Object.values(PaletteCommandVariables).includes(value as PaletteCommandVariables)
}

export interface PaletteCommand {
  name: string
  description: string
  signature: CommandSignature
  command: (...variables: any[]) => void
}

export default class Palette {
  private show: boolean = false
  private commands: PaletteCommand[] = []
  private palette?: El

  constructor(private apex: Apex) {
    const paletteEl = document.getElementById('prun-palette')
    if (paletteEl) paletteEl.remove()
  }

  public get Open() {
    return this.show
  }

  public addCommand(command: PaletteCommand) {
    this.commands.push(command)
  }

  public removeCommand(name: string) {
    this.commands = this.commands.filter((command) => command.name !== name)
  }

  public toggle() {
    if (this.show) {
      this.close()
    } else {
      this.open()
    }
  }

  public open() {
    this.show = true
    if (document.getElementById('prun-palette')) {
      console.debug('[PuUn Palette] Palette already open')
      return
    }
    console.debug('[PuUn Palette] Rendering palette')

    this.palette = palette({
      fuzzNextArg: this.fuzzyNextArg.bind(this),
      getTopMatches: this.sortedMatches.bind(this),
      execute: this.executeSignature.bind(this),
      close: this.close.bind(this),
    })
    this.palette.mount$(document.body)
  }

  public close() {
    this.show = false
    if (this.palette) {
      this.palette.unmount$()
      console.debug('[PuUn Palette] Removing palette')
    } else {
      console.debug('[PuUn Palette] Palette not found')
    }
  }

  @memoize()
  private signaturesMatches(a: CommandSignature, b: CommandSignature): boolean {
    if (a.length !== b.length) return false
    return a.every((sig, i) => {
      if (isPaletteCommandVariable(sig) || isPaletteCommandVariable(b[i])) return true
      return sig === b[i]
    })
  }

  @memoize()
  private signatureStartsWith(sig: CommandSignature, prefix: CommandSignature): boolean {
    if (sig.length < prefix.length) return false
    for (let i = 0; i < prefix.length; i++) {
      if (isPaletteCommandVariable(prefix[i]) || isPaletteCommandVariable(sig[i])) continue
      if (sig[i] !== prefix[i]) return false
    }
    return true
  }

  private getCommandsStartingWithSig(partialSig: CommandSignature): PaletteCommand[] {
    return this.commands.filter(
      (command) => this.signatureStartsWith(command.signature, partialSig)
    )
  }

  private getCommandMatchingSig(sig: CommandSignature): PaletteCommand | null {
    const command = this.commands.find(
      (command) => this.signaturesMatches(sig, command.signature)
    )
    return command || null
  }

  public sortedMatches(partialSig: CommandSignature, input: string): PaletteCommand[] {
    const partialMatches = this.getCommandsStartingWithSig(partialSig)
    if (partialMatches.length === 0) return []

    const exactMatch = this.getCommandMatchingSig(partialSig)
    const matchesWithVariables = partialMatches.filter(
      (command) => isPaletteCommandVariable(command.signature[partialSig.length])
    )
    const partialCommands = partialMatches.filter(
      (command) => command !== exactMatch
        && !matchesWithVariables.includes(command)
    )
    const nextArgs = partialCommands.map((command) => command.signature[partialSig.length])

    const scoredCommands = matchArrays(partialCommands, fuzzStrings(input, nextArgs))
      .filter((match): match is [PaletteCommand, number] => match[1] !== undefined)
      .sort((a, b) => b[1] - a[1])

    return [
      input === '' && exactMatch,
      ...matchesWithVariables,
      ...scoredCommands.map((match) => match[0]),
    ].filter((command): command is PaletteCommand => !!command)
  }

  public fuzzyNextArg(partialSig: CommandSignature, input: string): string | null {
    if (input.length === 0) return null

    const partialMatches = this.getCommandsStartingWithSig(partialSig)
      .filter(
        (command) => {
          if (
            isPaletteCommandVariable(command.signature[partialSig.length])
            && command.signature[partialSig.length] !== PaletteCommandVariables.Screen
          ) return false
          return command.signature.length > partialSig.length
        }
      )
    if (partialMatches.length === 0) return null

    const nextArgs = partialMatches.map((command) => {
      const nextArg = command.signature[partialSig.length]
      if (!isPaletteCommandVariable(nextArg)) return nextArg
      if (nextArg === PaletteCommandVariables.Screen) return this.apex.screens.map(s => s.name.toLowerCase())
      return []
    }).flat()

    const scoredCommands = matchArrays(nextArgs, fuzzStrings(input, nextArgs))
      .filter((match): match is [string, number] => match[1] !== undefined)
      .sort((a, b) => b[1] - a[1])

    const bestMatch = scoredCommands[0]
    if (!bestMatch) return null
    return bestMatch[0]
  }

  public executeSignature(partialSig: CommandSignature, input: string) {
    // If no input, find exact match on signature
    // TODO: Try fuzzy matching on signature, in case the input is a partial
    // match on the signature and not a variable
    const matches = this.sortedMatches(partialSig, input)
    if (matches.length === 0) return
    const match = matches[0]

    if (input !== '') {
      const fuzzed = this.fuzzyNextArg(partialSig, input)
      if (fuzzed) input = fuzzed
      partialSig.push(input)
    }

    // Get indexes of variables in signature
    const indexes: number[] = []
    match.signature.forEach((arg, i) => {
      if (isPaletteCommandVariable(arg)) indexes.push(i)
    })

    // Get values of variables in signature
    const variables = indexes.map((i) => partialSig[i])
    match.command(...variables)
  }
}
