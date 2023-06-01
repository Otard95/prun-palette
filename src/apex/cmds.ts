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
import Apex from "./base";
import { GConstructor } from 'mixin'

const cmdsWithArgs = [
  ['ADM', 'Planet Identifier', ''],
  ['ADMT', 'Planet Identifier, Term identifier', ''],
  ['APEXM', '', ''],
  ['BBC', 'Base', ''],
  ['BBL', 'Base', ''],
  ['BDGS', '', ''],
  ['BLU', '', 'Blueprint'],
  ['BRA', '', ''],
  ['BS', '', 'Base'],
  ['BSC', 'Planet id', ''],
  ['BTF', 'Blueprint', ''],
  ['BUI', 'Building ticker', ''],
  ['CMDS', '', ''],
  ['CO', 'Company Code or ID', ''],
  ['COGC', 'Planet', ''],
  ['COGCPD', 'Planet, Program name', ''],
  ['COGCPEX', 'Planet', ''],
  ['COGCU', 'Planet', ''],
  ['COLIQ', '', ''],
  ['COM', '', ''],
  ['COMC', '', ''],
  ['COMF', '', ''],
  ['COMG', 'Channel Identifier', ''],
  ['COMP', 'Channel Identifier', ''],
  ['COMU', 'Username', ''],
  ['CONS', '', ''],
  ['CONT', 'Contract', ''],
  ['CONTD', '', 'Draft'],
  ['CONTS', '', ''],
  ['CORP', '', ''],
  ['CORPFIN', '', ''],
  ['CORPIVS', '', 'Company Code'],
  ['CORPNP', '', ''],
  ['CORPP', '', 'Project id'],
  ['CORPS', '', 'Corporation Code'],
  ['CS', '', ''],
  ['CX', 'Market Identifier Code', ''],
  ['CXL', '', ''],
  ['CXM', 'Material ticker', 'Planet to determine distance from'],
  ['CXO', 'Order ID', ''],
  ['CXOB', 'Ticker', ''],
  ['CXOS', '', ''],
  ['CXP', 'Ticker', ''],
  ['CXPC', 'Ticker', ''],
  ['CXPO', 'Ticker', ''],
  ['EXP', 'Base', ''],
  ['FA', 'Faction code', ''],
  ['FIN', '', ''],
  ['FINBS', '', ''],
  ['FINIS', '', ''],
  ['FINLA', '', ''],
  ['FLT', '', 'Address'],
  ['FLTP', 'Planet ID', ''],
  ['FLTS', 'System ID', ''],
  ['FX', '', ''],
  ['FXO', 'Order ID', ''],
  ['FXOB', 'Ticker', ''],
  ['FXOS', '', ''],
  ['FXP', 'FX ticker', ''],
  ['FXPC', 'FX ticker', ''],
  ['FXPO', 'FX ticker', ''],
  ['HELP', '', ''],
  ['HQ', '', ''],
  ['INF', '', 'System'],
  ['INV', '', 'Inventory'],
  ['LIC', '', ''],
  ['LM', 'Local Market Identifier', ''],
  ['LMA', 'Local Market Ad Identifier', ''],
  ['LMBL', '', ''],
  ['LMOS', '', ''],
  ['LMP', 'Local Market Identifier', ''],
  ['LR', 'Planet Identifier', ''],
  ['MAT', 'Material ticker', ''],
  ['MS', 'System', ''],
  ['MTRA', '', 'Material ticker, Origin store ID, Target store ID'],
  ['MU', '', 'Mode'],
  ['NOTIG', '', ''],
  ['NOTPNS', '', ''],
  ['NOTS', '', ''],
  ['PLI', '', 'Planet'],
  ['PLNM', 'Catalog ID', ''],
  ['POPI', 'Planet', ''],
  ['POPID', 'Planet, Infrastructure type', ''],
  ['POPR', '', 'Planet'],
  ['PP', 'Planet, Planetary project', ''],
  ['PPS', 'Planet', ''],
  ['PROD', '', 'Base'],
  ['PRODCO', 'Production line', ''],
  ['PRODQ', 'Production line', ''],
  ['PSI', 'Site', ''],
  ['RSB', '', ''],
  ['SFC', 'Ship', ''],
  ['SHP', 'Transponder', ''],
  ['SHPF', 'Transponder', ''],
  ['SHPI', 'Transponder', ''],
  ['SHY', '', 'Location Identifier'],
  ['SHYP', '', 'Shipyard Project Identifier'],
  ['SI', 'Transponder', ''],
  ['STNS', '', 'Station identifier'],
  ['SYSI', '', 'System'],
  ['SYSNM', 'Catalog ID', ''],
  ['TRA', '', ''],
  ['USR', 'Username', ''],
  ['WAR', 'Warehouse Identifier', ''],
  ['WF', 'Base', ''],
]
const cmds = cmdsWithArgs.map((cmd) => cmd[0])

console.debug('[PrUn Palette] Loaded cmds.ts', cmds)

export type Cmds = GConstructor<{
  get Cmds(): string[]
}>

export function Cmds<TBase extends GConstructor<Apex>>(Base: TBase) {
  return class Cmds extends Base {
    public get Cmds(): string[] {
      return cmds
    }
  }
}
