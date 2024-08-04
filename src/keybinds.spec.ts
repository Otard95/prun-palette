import Keybinds from './keybinds'

// @ts-ignore
global.KeyboardEvent = Object

let keyEventListener: KeyboardEventListener
const keyEventListenerSpy = jest.fn()
const mockElement = {
  addEventListener: jest
    .fn()
    .mockImplementation(
      (_eventType: string, fn: KeyboardEventListener & jest.Mock) => {
        keyEventListener = (...args) => {
          keyEventListenerSpy(...args)
          fn(...args)
        }
      }
    ),
}

console.debug = () => {}

beforeEach(() => keyEventListenerSpy.mockClear())

describe('Keybinds', () => {
  const keybinds = new Keybinds(mockElement as unknown as Window)

  beforeEach(() => keybinds.clearAll())

  it('should call `addEventListener` on instancing', () => {
    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'keydown',
      expect.any(Function)
    )
    expect(keyEventListener).not.toBeUndefined()
  })

  describe('alpha binds', () => {
    it('should be able to handle simple alpha key binds', () => {
      const fn = jest.fn()
      keybinds.addKeybind('a', fn)
      keyEventListener(key('a'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should be able to handle a bind with a sequence of alpha keys', () => {
      const fn = jest.fn()
      keybinds.addKeybind('abc', fn)
      keyEventListener(key('a'))
      keyEventListener(key('b'))
      keyEventListener(key('c'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should handle shifted alpha keys bound as uppercase letters', () => {
      const fn = jest.fn()
      keybinds.addKeybind('A', fn)
      keyEventListener(key('a').shift())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
  })

  describe('symbol binds', () => {
    it('should be able to handle simple symbol key binds', () => {
      const fn = jest.fn()
      keybinds.addKeybind('$', fn)
      keyEventListener(key('$'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should be able to handle a bind with a sequence of symbol keys', () => {
      const fn = jest.fn()
      keybinds.addKeybind('#$%', fn)
      keyEventListener(key('#'))
      keyEventListener(key('$'))
      keyEventListener(key('%'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
  })

  describe('multiple overlapping binds', () => {
    it('should activate a bind overlapping a longer bind after 500ms', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      keybinds.addKeybind('a', fn1)
      keybinds.addKeybind('ab', fn2)
      keyEventListener(key('a'))

      expect(keyEventListenerSpy).toHaveBeenCalled()

      await wait(490)

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()

      await wait(20)

      expect(fn1).toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
    })

    it('should activate a bind overlapping a longer bind if the next key is not in the longer', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      keybinds.addKeybind('a', fn1)
      keybinds.addKeybind('ab', fn2)
      keyEventListener(key('a'))

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()

      keyEventListener(key(' '))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn1).toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
    })

    it('should not activate a bind overlapping a longer bind if the next key is <esc>', async () => {
      const fn1 = jest.fn()
      const fn2 = jest.fn()
      keybinds.addKeybind('a', fn1)
      keybinds.addKeybind('ab', fn2)
      keyEventListener(key('a'))

      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()

      keyEventListener(key('<esc>'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn1).not.toHaveBeenCalled()
      expect(fn2).not.toHaveBeenCalled()
    })
  })

  describe('modifier notation', () => {
    it('should be able to handle simple moded alpha key', () => {
      const fn = jest.fn()
      keybinds.addKeybind('<c-a>', fn)
      keyEventListener(key('a').ctrl())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })
  })
})

function wait(ms: number): Promise<void> {
  return new Promise(res => setTimeout(res, ms))
}

function key(key: string): MockKeyboardEventBuilder {
  return new MockKeyboardEventBuilder(key)
}
class MockKeyboardEventBuilder implements MockKeyboardEvent {
  key: string
  ctrlKey = false
  shiftKey = false
  altKey = false
  metaKey = false

  constructor(key: string) {
    this.key = key
  }

  preventDefault = jest.fn()

  ctrl() {
    this.ctrlKey = true
    return this
  }
  shift() {
    this.shiftKey = true
    this.key = this.key.toUpperCase()
    return this
  }
  alt() {
    this.altKey = true
    return this
  }
  meta() {
    this.metaKey = true
    return this
  }
}

type KeyboardEventListener = (event: MockKeyboardEvent) => void
interface MockKeyboardEvent {
  key: string
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  preventDefault(): void
}
