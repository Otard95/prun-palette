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
