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
