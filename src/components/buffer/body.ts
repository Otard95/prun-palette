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
import { Children, div } from '../../utils/dom'

interface BufferBodyProps {
  name: string
  command?: string
}
export default function bufferBody(
  { name, command }: BufferBodyProps,
  ...children: Children
) {
  return div(
    div(
      div(name).att$(
        'class',
        'TileFrame__title___xRcZCPx fonts__font-small-headers___PZa5nr5'
      ),
      command &&
        div(command).att$(
          'class',
          'TileFrame__cmd___ScBYW0n type__type-very-small___HaVMqrE'
        )
    ).att$(
      'class',
      'TileFrame__header___R4a5yN4 fonts__font-regular___Sxp1xjo type__type-regular___k8nHUfI'
    ),
    div(div(...children).att$('class', 'TileFrame__anchor___Xb0b6Wd')).att$(
      'class',
      'TileFrame__body___cQnujNJ fonts__font-regular___Sxp1xjo type__type-regular___k8nHUfI'
    )
  ).att$('class', 'TileFrame__frame___Rc3uM9N')
}
