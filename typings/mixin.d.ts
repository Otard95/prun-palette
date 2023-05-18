declare module 'mixin' {
  export type GConstructor<T = {}> = new (...args: any[]) => T;
}
