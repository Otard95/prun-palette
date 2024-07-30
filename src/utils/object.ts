export function isEmpty(value: object): boolean {
  return Object.getOwnPropertyNames(value).length === 0
}
