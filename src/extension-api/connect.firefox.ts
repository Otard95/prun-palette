import { ConnectFn, PortOut } from './interface'

export const connect: ConnectFn = connectInfo => {
  if (!connectInfo) {
    const port = browser.runtime.connect()
    return port as PortOut
  } else {
    const port = browser.runtime.connect(connectInfo)
    return port as PortOut
  }
}
