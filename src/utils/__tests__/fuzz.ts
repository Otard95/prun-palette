import { fuzzStrings } from '../fuzz';

describe('fuzzStrings', () => {
  const subject = 'abc'

  it(
    'should return a score for each option that contains all characters in the subject in the same order', 
    () => {
      const options = ['abc', 'def', 'ab', 'a', '']
      const expected = [3, undefined, undefined, undefined, undefined]
      expect(fuzzStrings(subject, options)).toEqual(expected)
    }
  )
})
