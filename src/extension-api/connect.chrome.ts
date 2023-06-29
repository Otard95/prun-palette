import { ConnectFn, PortOut } from './interface'

export const connect: ConnectFn = connectInfo => {
  const port = chrome.runtime.connect(connectInfo)
  return port as PortOut
}
