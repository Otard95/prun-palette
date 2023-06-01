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
import { escapeRegExp, regexpIncludesString, regexpMatchString } from '../regexp'

describe('escapeRegExp', () => {
  it('should escape special characters', () => {
    expect(escapeRegExp('.*+?^${}()|[]\\')).toEqual('\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\')
  })
})

describe('regexpMatchString', () => {
  it('should match the a string exactly', () => {
    const regexp = regexpMatchString('hello')
    expect(regexp.test('hello world')).toBeFalsy()
    expect(regexp.test('hello')).toBeTruthy()
    expect(regexp.test('hell')).toBeFalsy()
    expect(regexp.test('world')).toBeFalsy()
  })

  it('should match the a string exactly with special characters', () => {
    const string = '.*+?^${}()|[]\\'
    const regexp = regexpMatchString(string)
    expect(regexp.test(string)).toBeTruthy()
  })
})

describe('regexpIncludesString', () => {
  it('should match anywhere in a string', () => {
    const regexp = regexpIncludesString('hello')
    expect(regexp.test('hello world')).toBeTruthy()
    expect(regexp.test('hello')).toBeTruthy()
    expect(regexp.test('hell')).toBeFalsy()
    expect(regexp.test('world')).toBeFalsy()
  })

  it('should match anywhere in a string with special characters', () => {
    const string = '.*+?^${}()|[]\\'
    const testString = `hello ${string} world`
    const regexp = regexpIncludesString(string)
    expect(regexp.test(testString)).toBeTruthy()
  })
})
