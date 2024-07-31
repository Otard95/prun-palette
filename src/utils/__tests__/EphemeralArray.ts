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
import EphemeralArray from '../ephemeral-array'

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

describe('EphemeralArray', () => {
  describe('constructor', () => {
    it('should create an array', () => {
      const array = new EphemeralArray(100)
      expect(array).toBeInstanceOf(Array)
    })
  })

  describe('push', () => {
    it('should add an item to the array', () => {
      const array = new EphemeralArray<string>(100)
      array.push('test')
      expect(array.length).toEqual(1)

      array.push('test 2')
      expect(array.length).toEqual(2)
      expect(array[0]).toEqual('test')
      expect(array[1]).toEqual('test 2')
    })
  })

  describe('unshift', () => {
    it('should add an item to the array', () => {
      const array = new EphemeralArray<string>(100)
      array.push('test')
      array.unshift('test 2')
      expect(array.length).toEqual(2)
      expect(array[0]).toEqual('test 2')
      expect(array[1]).toEqual('test')
    })
  })

  describe('pop', () => {
    it('should remove the last item from the array', () => {
      const array = new EphemeralArray<string>(100)
      array.push('test')
      array.push('test 2')
      const item = array.pop()
      expect(item).toEqual('test 2')
      expect(array.length).toEqual(1)
      expect(array[0]).toEqual('test')
    })
  })

  describe('shift', () => {
    it('should remove the first item from the array', () => {
      const array = new EphemeralArray<string>(100)
      array.push('test')
      array.push('test 2')
      const item = array.shift()
      expect(item).toEqual('test')
      expect(array.length).toEqual(1)
      expect(array[0]).toEqual('test 2')
    })
  })

  describe('timeout', () => {
    describe('push', () => {
      it('should remove the item after the timeout', async () => {
        const array = new EphemeralArray<string>(100)
        array.push('test')

        await wait(200)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })

      it('should reset the timeout when pushing', async () => {
        const array = new EphemeralArray<string>(100)
        array.push('test')

        await wait(50)

        expect(array.length).toEqual(1)
        expect(array[0]).toEqual('test')

        array.push('test 2')

        await wait(50)

        expect(array.length).toEqual(2)
        expect(array[0]).toEqual('test')
        expect(array[1]).toEqual('test 2')

        await wait(150)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })
    })

    describe('unshift', () => {
      it('should remove the item after the timeout', async () => {
        const array = new EphemeralArray<string>(100)
        array.unshift('test')

        await wait(200)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })

      it('should reset the timeout when pushing', async () => {
        const array = new EphemeralArray<string>(100)
        array.unshift('test')

        await wait(50)

        expect(array.length).toEqual(1)
        expect(array[0]).toEqual('test')

        array.unshift('test 2')

        await wait(50)

        expect(array.length).toEqual(2)
        expect(array[0]).toEqual('test 2')
        expect(array[1]).toEqual('test')

        await wait(150)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })
    })

    describe('pop', () => {
      it('should reset the timeout when poping', async () => {
        const array = new EphemeralArray<string>(100)
        array.push('test')
        array.push('test 2')

        await wait(50)

        expect(array.length).toEqual(2)
        expect(array[0]).toEqual('test')
        expect(array[1]).toEqual('test 2')

        array.pop()

        await wait(50)

        expect(array.length).toEqual(1)
        expect(array[0]).toEqual('test')

        await wait(150)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })
    })

    describe('shift', () => {
      it('should reset the timeout when shifting', async () => {
        const array = new EphemeralArray<string>(100)
        array.push('test')
        array.push('test 2')

        await wait(50)

        expect(array.length).toEqual(2)
        expect(array[0]).toEqual('test')
        expect(array[1]).toEqual('test 2')

        array.shift()

        await wait(50)

        expect(array.length).toEqual(1)
        expect(array[0]).toEqual('test 2')

        await wait(150)

        expect(array.length).toEqual(0)
        expect(array[0]).toBeUndefined()
      })
    })
  })
})


