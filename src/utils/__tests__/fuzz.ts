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
import { fuzzStrings } from '../fuzz';

describe('fuzzStrings', () => {
  const subject = 'abc'

  it(
    'should return a score for each option that contains all characters in the subject in the same order', 
    () => {
      const options = ['abc', 'def', 'ab', 'a', '']
      const expected = [6, undefined, undefined, undefined, undefined]
      expect(fuzzStrings(subject, options)).toEqual(expected)
    }
  )
})


