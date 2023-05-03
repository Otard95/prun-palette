/**
 * Checks if an array starts with another array.
 * Like String.prototype.startsWith but for arrays.
 *
 * @param array The array to check.
 * @param prefix The prefix to check.
 * @returns True if the array starts with the prefix, false otherwise.
 */
export function arrayStartsWith<T>(array: T[], prefix: T[]): boolean {
  if (prefix.length > array.length) return false
  for (let i = 0; i < prefix.length; i++) {
    if (array[i] !== prefix[i]) return false
  }
  return true
}

/**
 * Checks if two arrays contain the same elements in the same order.
 *
 * @param a The first array.
 * @param b The second array.
 * @returns True if the arrays are equal, false otherwise.
 */
export function arrayEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false
  }
  return true
}

export function matchArrays<A, B>(a: A[], b: B[]): [A, B][] {
  const matches: [A, B][] = []
  if (a.length !== b.length) throw new Error('Arrays must be of equal length')
  for (let i = 0; i < a.length; i++) {
    matches.push([a[i], b[i]])
  }
  return matches
}
