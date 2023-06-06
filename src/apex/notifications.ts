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
import { GConstructor } from 'mixin'
import { Buffer } from './buffer'
import { Events } from './events'
import { Util } from './utils'
import './notifications.sass'

enum NotificationElementSelector {
  AlertListItem = 'div[class^="AlertListItem__container"]',
  AlertListItemContent = 'div[class^="AlertListItem__content"]',
}

export type Notification = GConstructor<{
  markAllNotificationsRead(): Promise<void>
  markAllNotificationsSeen(): Promise<void>
  openNotificationIndex(index: number): Promise<void>
}>

export function Notification<TBase extends Buffer & Events & Util>(
  Base: TBase
) {
  return class Notification extends Base {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args)

      this.events.on('new-buffer', (buffer, cmd) => {
        if (cmd === 'NOTS') {
          this.numberAlerts(buffer)
        }
      })
    }

    private createAlertIndex(index: number): HTMLDivElement {
      const alertIndex = document.createElement('div')
      alertIndex.classList.add('prun-alert-index')
      alertIndex.innerText = index.toString()
      return alertIndex
    }

    private async numberAlerts(buffer: Element) {
      await this.observer.waitFor(NotificationElementSelector.AlertListItem, {
        within: buffer,
      })
      const alerts = buffer?.querySelectorAll(
        NotificationElementSelector.AlertListItem
      )
      if (!alerts) return

      // Add numeric index to each alert
      alerts.forEach((alert, i) => {
        const alertContent = alert.querySelector(
          NotificationElementSelector.AlertListItemContent
        )
        if (!alertContent) return

        const alertIndex = this.createAlertIndex(i + 1)
        alertContent.before(alertIndex)
      })
    }

    public async markAllNotificationsRead() {
      const buffer = await this.createBuffer('NOTS')
      const buttons = buffer?.querySelectorAll('button')

      if (!buttons) return

      buttons.forEach(button => {
        const btnText = button.innerText.toLowerCase()
        if (['all', 'read'].every(s => btnText.includes(s))) button.click()
      })

      if (buffer) this.closeBuffer(buffer)
    }

    public async markAllNotificationsSeen() {
      const buffer = await this.createBuffer('NOTS')
      const buttons = buffer?.querySelectorAll('button')

      if (!buttons) return

      buttons.forEach(button => {
        const btnText = button.innerText.toLowerCase()
        if (['all', 'seen'].every(s => btnText.includes(s))) button.click()
      })

      if (buffer) this.closeBuffer(buffer)
    }

    public async openNotificationIndex(index: number) {
      const alertItemsPromise = this.observer.waitFor(
        NotificationElementSelector.AlertListItem,
        { onlyNew: true }
      )
      const buffer = await this.createBuffer('NOTS')
      await alertItemsPromise
      const alerts = buffer?.querySelectorAll(
        NotificationElementSelector.AlertListItem
      )

      if (!alerts) return

      const alert = alerts[index - 1]
      if (!alert || !(alert instanceof HTMLDivElement)) return

      alert.click()

      if (buffer) this.closeBuffer(buffer)
    }
  }
}
