/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2024  Stian Myklebostad

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
export const fuzzStrings = (str: string, options: string[]) => {
  const score = (subject: string, option: string): number | undefined => {
    let s = 0
    let consecutive = 0

    let i = 0
    let j = 0
    while (i < subject.length && subject.length - i <= option.length - j) {
      if (subject[i] === option[j]) {
        s += ++consecutive
        i++
        j++
        continue
      }
      consecutive = 0
      s--
      j++
    }

    if (i < subject.length) return undefined
    return s
  }

  return options.map(option => score(str.toLowerCase(), option.toLowerCase()))
}
