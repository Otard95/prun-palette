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
import { GConstructor } from "mixin"
import { Buffer } from "./buffer"
import { Util } from "./utils"

// enum NotificationElementSelector {
//   AlertListItem = 'div[class^="AlertListItem__container"]',
//   AlertListItemContent = 'div[class^="AlertListItem__content"]',
// }

export type Notification = GConstructor<{
  openNotifications(): Promise<Element | null>
  markAllNotificationsRead(): Promise<void>
  markAllNotificationsSeen(): Promise<void>
}>

export function Notification<TBase extends Util & Buffer>(Base: TBase) {
  return class Notification extends Base {
    // private createAlertIndex(index: number): HTMLDivElement {
    //   const alertIndex = document.createElement('div')
    //   alertIndex.classList.add('alert-index')
    //   alertIndex.innerText = index.toString()
    //   return alertIndex
    // }

    public async openNotifications() {
      return await this.createBuffer('NOTS')
      // const buffer = await this.createBuffer('NOTS')

      // this.observer.waitFor(NotificationElementSelector.AlertListItem)

      // const alerts = buffer?.querySelectorAll(NotificationElementSelector.AlertListItem)
      // if (!alerts) return

      // // Add numeric index to each alert
      // alerts.forEach((alert, i) => {
      //   const alertContent = alert.querySelector(NotificationElementSelector.AlertListItemContent)
      //   if (!alertContent) return

      //   const alertIndex = this.createAlertIndex(i + 1)
      //   alertContent.before(alertIndex)
      // })
    }

    public async markAllNotificationsRead() {
      const buffer = await this.openNotifications()
      const buttons = buffer?.querySelectorAll('button')

      if (!buttons) return

      buttons.forEach((button) => {
        const btnText = button.innerText.toLowerCase()
        if (
          ['all', 'read'].every(
            s => btnText.includes(s)
          )
        ) button.click()
      })

      if (buffer)
        this.closeBuffer(buffer)
    }

    public async markAllNotificationsSeen() {
      const buffer = await this.openNotifications()
      const buttons = buffer?.querySelectorAll('button')

      if (!buttons) return

      buttons.forEach((button) => {
        const btnText = button.innerText.toLowerCase()
        if (
          ['all', 'seen'].every(
            s => btnText.includes(s)
          )
        ) button.click()
      })

      if (buffer)
        this.closeBuffer(buffer)
    }
  }
}
