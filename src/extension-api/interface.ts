export type MessageSender = Omit<browser.runtime.MessageSender, 'tab'>

export interface PortOut
  extends Omit<
    browser.runtime.Port,
    'sender' | 'error' | 'onMessage' | 'postMessage'
  > {
  onMessage: {
    addListener: (listener: (message: object) => void) => void
  }
  postMessage: (message: object) => void
}

export interface PortIn
  extends Omit<
    browser.runtime.Port,
    'sender' | 'error' | 'onMessage' | 'postMessage'
  > {
  onMessage: {
    addListener: (listener: (message: object) => void) => void
  }
  postMessage: (message: object) => void
  sender: MessageSender
}

export type ConnectFn = (connectInfo?: {
  name?: string | undefined
  includeTlsChannelId?: boolean | undefined
}) => PortOut

export type OnConnectFn = (listener: (port: PortIn) => void) => void
// browser.runtime.onConnect
// chrome.runtime.onConnect
