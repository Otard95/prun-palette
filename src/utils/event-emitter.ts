type ListenerFn<T extends Array<any>> = (...args: T) => void
interface Listener<T extends Array<any>> {
  fn: ListenerFn<T>
  once?: boolean
}

export default class EventEmitter<EventMap extends Record<string, Array<any>>> {
  private listeners: {
    [K in keyof EventMap]?: Set<Listener<EventMap[K]>>
  } = {}

  public on<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event] || new Set<Listener<EventMap[K]>>()
    listeners.add({ fn })
    this.listeners[event] = listeners
  }

  public once<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event] || new Set<Listener<EventMap[K]>>()
    listeners.add({ fn, once: true })
    this.listeners[event] = listeners
  }

  public off<K extends keyof EventMap>(event: K, fn: ListenerFn<EventMap[K]>) {
    const listeners = this.listeners[event]
    if (!listeners) return

    listeners.forEach((listener) => {
      if (listener.fn === fn) listeners.delete(listener)
    })
  }

  public emit<K extends keyof EventMap>(event: K, ...args: EventMap[K]) {
    const listeners = this.listeners[event]
    if (!listeners) return

    listeners.forEach((listener) => {
      listener.fn(...args)
      if (listener.once) listeners.delete(listener)
    })
  }

  public clear() {
    this.listeners = {}
  }
}
