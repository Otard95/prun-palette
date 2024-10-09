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
type CompressionStream = GenericTransformStream
type DecompressionStream = GenericTransformStream
type CompressionFormat = 'deflate' | 'deflate-raw' | 'gzip'
declare const CompressionStream: {
  prototype: CompressionStream
  new (format: CompressionFormat): CompressionStream
}
declare const DecompressionStream: {
  prototype: DecompressionStream
  new (format: CompressionFormat): DecompressionStream
}

export function compress(
  string: string,
  encoding: CompressionFormat
): Promise<ArrayBuffer> {
  const byteArray = new TextEncoder().encode(string)
  const cs = new CompressionStream(encoding)
  const writer = cs.writable.getWriter()
  writer.write(byteArray)
  writer.close()
  return new Response(cs.readable).arrayBuffer()
}

export async function decompress(
  byteArray: ArrayBuffer,
  encoding: CompressionFormat
): Promise<string> {
  const cs = new DecompressionStream(encoding)
  const writer = cs.writable.getWriter()
  writer.write(new Uint8Array(byteArray))
  writer.close()
  const arrayBuffer = await new Response(cs.readable).arrayBuffer()
  return new TextDecoder().decode(arrayBuffer)
}

export function encode(ab: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(ab)))
}
export function decode(str: string): ArrayBuffer {
  const bytes = atob(str)
  return Uint8Array.from({ length: bytes.length }, (_, i) =>
    bytes.charCodeAt(i)
  ).buffer
}
