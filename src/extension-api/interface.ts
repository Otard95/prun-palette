export interface PortOut
  extends Omit<
    browser.runtime.Port,
    'sender' | 'error' | 'onMessage' | 'postMessage'
  > {
  onMessage: {
    addListener: (listener: (message: unknown) => void) => void
  }
  postMessage: (message: unknown) => void
}

export type ConnectFn = (connectInfo?: {
  name?: string | undefined
  includeTlsChannelId?: boolean | undefined
}) => PortOut
