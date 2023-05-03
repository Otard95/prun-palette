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
