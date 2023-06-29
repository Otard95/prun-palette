import { OnConnectFn, PortIn } from './interface'

export const onConnect: OnConnectFn = listener => {
  browser.runtime.onConnect.addListener(port => {
    if (!port.sender) {
      throw new Error('port.sender is undefined')
    }
    listener(port as PortIn)
  })
}
