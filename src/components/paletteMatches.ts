import { PaletteCommand } from '../palette'
import { div, h3, p } from '../utils/dom'
import { memoizee } from '../utils/memoize'
import './paletteMatches.sass'


function paletteMatches(topMatches: PaletteCommand[] = []) {
  return div(
    ...topMatches.map((match) => {
      return div(
        div(
          h3(match.name).att$('class', 'palette-match-name'),
          p(' - ', match.description).att$('class', 'palette-match-description'),
        ).att$('class', 'palette-match-header'),
        p(match.signature.join(' · ')).att$('class', 'palette-match-usage')
      ).att$('class', 'palette-match')
    }),
    topMatches.length === 0 && p('No matches found').att$('class', 'palette-match-empty')
  ).att$('class', 'palette-matches')
}

export default memoizee(paletteMatches)
