import ApexBase from './base'
import { Util } from './utils'
import { Inventory } from './inventory'

export default class Apex extends Inventory(Util(ApexBase)) {}
