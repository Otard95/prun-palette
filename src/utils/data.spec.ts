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
import { compress, decode, decompress, encode } from './data'

describe('encode and decode', () => {
  it('should end up with the same array buffer after encode and decode', () => {
    const buffer = getRandomArrayBuffer(100)

    expect(decode(encode(buffer))).toEqual(buffer)
  })
})

describe('compress and decompress', () => {
  it('should end up with the same array buffer after compress and decompress', async () => {
    const str = getRandomString(100)

    let compressed, decompressed

    try {
      compressed = await compress(str, 'gzip')
      console.log(compressed)
    } catch (error) {
      console.error('compress failed', error)
      throw error
    }

    try {
      decompressed = await decompress(compressed, 'gzip')
      console.log(compressed)
    } catch (error) {
      console.error('compress failed', error)
      throw error
    }

    expect(decompressed).toEqual(str)
  })
})

function getRandomArrayBuffer(len: number): ArrayBuffer {
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes.buffer
}

function getRandomString(len: number): string {
  let str = ''
  for (let i = 0; i < len; i++) {
    str += String.fromCharCode(Math.floor(Math.random() * 92) + 32)
  }
  return str
}
