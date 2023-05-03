// ==UserScript==
// @name         PrUn Palette
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Command Palette for ProspProsperous Universe
// @author       You
// @match        https://apex.prosperousuniverse.com/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// ==/UserScript==

import Apex from './apex'
import Keybinds from './keybinds'
import Palette, { PaletteCommandVariables } from './palette'

(async function() {
  console.debug('[PrUn Palette] Initializing...')

  const apex = new Apex()
  const keybinds = new Keybinds()
  const palette = new Palette(apex)

  // General commands
  palette.addCommand({
    name: 'Buffer',
    description: 'Open an empty buffer',
    command: () => apex.createBuffer(),
    signature: ['buffer'],
  })
  palette.addCommand({
    name: 'Buffer command',
    description: 'Open a buffer with a command',
    command: (command: string) => apex.createBuffer(command),
    signature: ['buffer', PaletteCommandVariables.Command],
  })

  // Contract commands
  palette.addCommand({
    name: 'Contracts',
    description: 'Open the contracts list',
    command: () => apex.createBuffer('CONTS'),
    signature: ['contract'],
  })
  palette.addCommand({
    name: 'Contract drafts',
    description: 'Open the contract drafts list',
    command: () => apex.createBuffer('CONTD'),
    signature: ['contract', 'drafts'],
  })

  // Screen commands
  palette.addCommand({
    name: 'Screen',
    description: 'Open a screen',
    command: (screen: string) => apex.screens
      .find((s) => s.name.toLowerCase() === screen.toLowerCase())
      ?.open(),
    signature: ['screen', PaletteCommandVariables.Screen],
  })

  await apex.ready

  console.debug('[PrUn Palette] test', apex.screens)

  keybinds.addKeybind('<C-p>', () => palette.toggle())
  keybinds.addKeybind('escape', (preventDefault) => {
    if (palette.Open) preventDefault()
    palette.close()
  }, { preventDefault: false })

  console.debug('[PrUn Palette] Ready!')
})()
