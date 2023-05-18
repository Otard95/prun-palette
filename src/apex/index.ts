import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'
import { FIO } from './fio'

export default class Apex extends FIO(Inventory(Util(ApexBase))) {}
