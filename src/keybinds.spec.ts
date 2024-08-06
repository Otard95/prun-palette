import Keybinds from './keybinds'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
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

  it('should not be able to set bind with single unknown char', () => {
    const fn = jest.fn()

    expect(() => keybinds.addKeybind('\t', fn)).toThrow()

    keyEventListener(key('\t'))

    expect(keyEventListenerSpy).toHaveBeenCalled()
    expect(fn).not.toHaveBeenCalled()
  })

  it('should not be able to set empty bind', () => {
    const fn = jest.fn()

    expect(() => keybinds.addKeybind('', fn)).toThrow()
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

  describe('special binds', () => {
    it('should be able to handle simple special key binds', () => {
      const fn = jest.fn()
      keybinds.addKeybind('<space>', fn)
      keyEventListener(key(' '))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should be able to handle a bind with a sequence of special keys', () => {
      const fn = jest.fn()
      keybinds.addKeybind('<space><tab>', fn)
      keyEventListener(key(' '))
      keyEventListener(key('tab'))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should handle the edge case for `<` and `>`', () => {
      const fn = jest.fn()
      keybinds.addKeybind('<lt><gt>', fn)
      keyEventListener(key('<').shift())
      keyEventListener(key('>').shift())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should not allow setting a keybind for the `<` and `>` keys without `<lt>` and `<gt>`', () => {
      const fn = jest.fn()

      expect(() => keybinds.addKeybind('<', fn)).toThrow()
      expect(() => keybinds.addKeybind('>', fn)).toThrow()

      keyEventListener(key('<').shift())
      keyEventListener(key('>').shift())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).not.toHaveBeenCalled()
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
    it.each(['c', 's', 'a', 'm'] as const)(
      'should be able to handle simple `%s` moded alpha key',
      mod => {
        const fn = jest.fn()
        keybinds.addKeybind(`<${mod}-a>`, fn)
        keyEventListener(key('a').mod(mod))

        expect(keyEventListenerSpy).toHaveBeenCalled()
        expect(fn).toHaveBeenCalled()
      }
    )

    it('should handle multiple mods on simple alpha key', () => {
      const fn = jest.fn()
      keybinds.addKeybind(`<csam-a>`, fn)
      keyEventListener(key('a').ctrl().shift().alt().meta())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it('should handle moded capitalized alpha key', () => {
      const fn = jest.fn()
      keybinds.addKeybind(`<C-A>`, fn)
      keyEventListener(key('a').ctrl().shift())

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toHaveBeenCalled()
    })

    it.each([
      ['', 'c', true],
      [' not', 's', false],
      [' not', 'a', false],
      [' not', 'm', false],
    ] as const)('should%s handle `<%s-...>` symbol', (_, mod, shouldHandle) => {
      const fn = jest.fn()

      shouldHandle
        ? expect(() => keybinds.addKeybind(`<${mod}-$>`, fn)).not.toThrow()
        : expect(() => keybinds.addKeybind(`<${mod}-$>`, fn)).toThrow()
      keyEventListener(key(`$`).mod(mod))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toBeCalledTimes(Number(shouldHandle))
    })

    it.each([
      ['', 'c', true],
      [' not', 's', false],
      ['', 'a', true],
      ['', 'm', true],
    ] as const)('should%s handle `<%s-lt|gt>`', (_, mod, shouldHandle) => {
      const fn = jest.fn()

      keybinds.addKeybind(`<${mod}-lt>`, fn)
      keybinds.addKeybind(`<${mod}-gt>`, fn)
      keyEventListener(key(`<`).mod(mod))
      keyEventListener(key(`>`).mod(mod))

      expect(keyEventListenerSpy).toHaveBeenCalled()
      expect(fn).toBeCalledTimes(Number(shouldHandle) * 2)
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

  mod(mod: 'c' | 's' | 'a' | 'm' | 'C' | 'S' | 'A' | 'M') {
    switch (mod.toLowerCase()) {
      case 'c':
        return this.ctrl()
      case 's':
        return this.shift()
      case 'a':
        return this.alt()
      case 'm':
        return this.meta()
      default:
        return this
    }
  }
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
