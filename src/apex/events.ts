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
import EventEmitter from '../utils/event-emitter'
import Apex from "./base";
import { GConstructor } from 'mixin'

type ApexEvents = {
  'new-buffer': [buffer: Element, command: string | undefined]
}

export type Events = GConstructor<{
  events: EventEmitter<ApexEvents>
}>

export function Events<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Events extends Base {
    public events = new EventEmitter<ApexEvents>()
  }
}
