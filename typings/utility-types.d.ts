declare module 'utility-types' {
  export type PromiseOrValue<T> = T | Promise<T>
}
