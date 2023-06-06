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
interface FIOPlanetSimple {
  PlanetNaturalId: string
  PlanetName: string
}
interface FIOSystem {
  Connections: [
    {
      SystemConnectionId: string
      ConnectingId: string
    },
    {
      SystemConnectionId: string
      ConnectingId: string
    }
  ]
  SystemId: string
  Name: string
  NaturalId: string
  Type: string
  PositionX: number
  PositionY: number
  PositionZ: number
  SectorId: string
  SubSectorId: string
  UserNameSubmitted: string
  Timestamp: string
}

export function fetchFIOPlanets() {
  return fetch('https://rest.fnar.net/planet/allplanets', {
    headers: {
      accept: 'application/json',
    },
  })
    .then(response => response.json())
    .then((planets: FIOPlanetSimple[]) =>
      planets.map(planet => ({
        id: planet.PlanetNaturalId,
        name: planet.PlanetName,
      }))
    )
    .catch(error => {
      console.error('[PrUn Palette](Apex) Failed to fetch planets', error)
    })
}

export function fetchFIOSystems() {
  return fetch('https://rest.fnar.net/systemstars', {
    headers: {
      accept: 'application/json',
    },
  })
    .then(response => response.json())
    .then((systems: FIOSystem[]) =>
      systems.map(system => ({
        id: system.NaturalId,
        name: system.Name,
      }))
    )
    .catch(error => {
      console.error('[PrUn Palette](Apex) Failed to fetch planets', error)
    })
}
