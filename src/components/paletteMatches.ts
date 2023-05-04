/*
    PrUn Palette - A command pallet for Prosperous Universe
    Copyright (C) 2023  Stian Myklebostad

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


