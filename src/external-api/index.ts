import { connect } from '../extension-api/connect'
import Palette from '../palette'

export const initExternalAPI = (palette: Palette) => {
  const port = connect()
  port.onMessage.addListener(message => {
    console.log('[PrUn Pallette] message', message)
  })
  port.postMessage({ type: 'init' })
  console.log('[PrUn Pallette] palette', palette)
}
