export const fuzzStrings = (str: string, options: string[]) => {
  const score = (subject: string, option: string): number | undefined => {
    let s = 0
    let consecutive = 0

    let i = 0
    let j = 0
    while (i < subject.length && subject.length - i <= option.length - j) {
      if (subject[i] === option[j]) {
        s += ++consecutive
        i++
        j++
        continue
      }
      consecutive = 0
      s--
      j++
    }

    if (i < subject.length) return undefined
    return s
  }

  return options.map((option) => score(str.toLowerCase(), option.toLowerCase()))
}
