import { onConnect } from './extension-api/onConnect'

onConnect(port => {
  console.debug('[PrUn Pallette](background) port', port)
  port.onMessage.addListener(message => {
    console.debug('[PrUn Pallette](background) message', message)
  })
  port.postMessage({ type: 'init' })
})
