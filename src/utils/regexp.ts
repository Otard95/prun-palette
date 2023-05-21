export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const regexpMatchString = (str: string, flags?: string) => {
  return new RegExp(`^${escapeRegExp(str)}$`, flags)
}

export const regexpIncludesString = (str: string, flags?: string) => {
  return new RegExp(`${escapeRegExp(str)}`, flags)
}