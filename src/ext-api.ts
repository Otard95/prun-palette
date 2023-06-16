import Palette from './palette'

console.log('[PrUn Pallette] Browser', browser)

const initExternalAPI = (palette: Palette) => {
  console.log('[PrUn Pallette] Registering external API', { palette })
  browser.runtime.onConnect.addListener(port => {
    console.log('[PrUn Pallette] Got port', { port })
    port.onMessage.addListener((message: unknown, port) => {
      console.log('[PrUn Pallette] Got message from port', { message, port })
    })
  })
}

export default initExternalAPI
