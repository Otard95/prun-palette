import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'
import { FIO } from './fio'
import { Events } from './events'
import { Buffer } from './buffer'
import { Screen } from './screen'
import { Ships } from './ships'

export default class Apex extends Screen(FIO(Inventory(Ships(Util(Buffer(Events(ApexBase))))))) {}
