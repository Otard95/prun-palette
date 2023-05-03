export default class Deferred<T> {
  private _resolve: (value: T | PromiseLike<T>) => void = () => {}
  private _reject: (reason?: any) => void = () => null
  private _promise: Promise<T>

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve
      this._reject = reject
    })
  }

  public get promise(): Promise<T> {
    return this._promise
  }

  public get resolve(): (value: T | PromiseLike<T>) => void {
    return this._resolve
  }

  public get reject(): (reason?: any) => void {
    return this._reject
  }
}
