/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2023  Stian Myklebostad

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
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


