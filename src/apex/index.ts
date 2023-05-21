import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'
import { FIO } from './fio'
import { Events } from './events'
import { Buffer } from './buffer'
import { Screen } from './screen'
import { Ships } from './ships'
import { Station } from './station'

export default class Apex extends Station(Screen(FIO(Inventory(Ships(Util(Buffer(Events(ApexBase)))))))) {}
