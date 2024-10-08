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
