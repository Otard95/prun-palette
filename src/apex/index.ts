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
import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'
import { FIO } from './fio'
import { Events } from './events'
import { Buffer } from './buffer'
import { Screen } from './screen'
import { Ships } from './ships'
import { Station } from './station'
import { Notification } from './notifications'

export default class Apex extends Notification  (
                                  Station       (
                                  Screen        (
                                  FIO           (
                                  Inventory     (
                                  Ships         (
                                  Util          (
                                  Buffer        (
                                  Events        (
                                  ApexBase      )))))))))
{}
