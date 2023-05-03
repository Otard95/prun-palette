type EphemeralArrayOnTimeoutHandler<T> = (items: T[]) => void

/**
 * An array which items are one persisted for a given time after the array was
 * last modified.
 */
export default class EphemeralArray<T> extends Array<T> {
  private timeout: number | null = null
  private onTimeoutHandlers: EphemeralArrayOnTimeoutHandler<T>[] = []

  constructor(private readonly ttl: number) {
    super()
  }

  public push(...items: T[]) {
    this.resetTimeout()
    return super.push(...items)
  }

  public unshift(...items: T[]) {
    this.resetTimeout()
    return super.unshift(...items)
  }

  public pop() {
    const item = super.pop()
    this.resetTimeout()
    return item
  }

  public shift() {
    const item = super.shift()
    this.resetTimeout()
    return item
  }

  private resetTimeout() {
    if (this.timeout !== null) clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this.onTimeoutHandlers.forEach((handler) => handler(this))
      this.length = 0
    }, this.ttl) as unknown as number
  }

  public onTimeout(callback: EphemeralArrayOnTimeoutHandler<T>) {
    this.onTimeoutHandlers.push(callback)
  }
}
