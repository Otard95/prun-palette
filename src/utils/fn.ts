export const debounce = <A extends Array<unknown>, R>(fn: (...args: A) => R, delay: number, max?: number) => {
  let timeout: number
  let maxTimeout: number
  const call = (...args: A) => {
    clearTimeout(timeout)
    clearTimeout(maxTimeout)
    maxTimeout = timeout = 0
    fn(...args)
  }
  return (...args: A): void => {
    clearTimeout(timeout)
    if (max && !maxTimeout) maxTimeout = setTimeout(() => call(...args), max) as unknown as number
    timeout = setTimeout(() => call(...args), delay) as unknown as number
  }
}
