import Apex from './apex'
import attachCommands from './commands'
import Keybinds from './keybinds'
import Palette from './palette'

(async function() {
  console.debug('[PrUn Palette] Initializing...')

  const apex = new Apex()
  const keybinds = new Keybinds()
  const palette = new Palette(apex)

  attachCommands(palette, apex)

  await apex.ready

  keybinds.addKeybind('<C-p>', () => palette.toggle())
  keybinds.addKeybind('escape', (preventDefault) => {
    if (palette.Open) preventDefault()
    palette.close()
  }, { preventDefault: false })

  console.debug('[PrUn Palette] Ready!')
})()
