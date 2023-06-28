declare module 'utility-types' {
  export type PromiseOrValue<T> = T | Promise<T>
  export type HasType<T, Q extends T> = Q
}
