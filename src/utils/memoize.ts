interface MemoizedValue<R> {
  value: R
  timestamp: number
}

/**
 * Memoize a function, caching the result for a given time to live (ttl).
 *
 * @param ttl - Time to live in milliseconds. If not given, the result is cached forever.
 * @returns A function that memoizes the result of the given function
 */
export const memoizee = <A extends Array<any>, R>(func: (...args: A) => R, ttl?: number): (...args: A) => R => {
  const cache = new Map<string, MemoizedValue<R>>()
  return function (...args: A): R {
    const key = JSON.stringify(args)
    const cachedValue = cache.get(key)
    if (cachedValue && (!ttl || Date.now() - cachedValue.timestamp < ttl)) {
      return cachedValue.value
    }
    const result = func(...args)
    cache.set(key, { value: result, timestamp: Date.now() })
    return result
  }
}

/**
 * Decorator for memoizing a function. The result is cached for `ttl` milliseconds.
 *
 * @param ttl - Time to live in milliseconds. If not given, the result is cached forever.
 * @returns A decorator that memoizes the result of the given function
 */
export const memoize = (ttl?: number): MethodDecorator => {
  return (_target: Object, _propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    if ('value' in descriptor) {
      const func = descriptor.value
      descriptor.value = memoizee(func, ttl)
    } else if ('get' in descriptor) {
      const func = descriptor.get
      if (!func) return descriptor
      descriptor.get = memoizee(func, ttl)
    }
    return descriptor
  }
}
