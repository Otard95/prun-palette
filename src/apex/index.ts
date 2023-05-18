import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'
import { FIO } from './fio'
import { Events } from './events'
import { Buffer } from './buffer'
import { Screen } from './screen'

export default class Apex extends Screen(FIO(Inventory(Util(Buffer(Events(ApexBase)))))) {}
