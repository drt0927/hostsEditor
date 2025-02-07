import { app, Menu, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'
export type TraySubmenuType = 'HostsEditor' | 'Quit'

class TrayWrapper {
  tray!: Tray
  create() {
    this.tray = new Tray(icon)
    this.tray.setIgnoreDoubleClickEvents(true)
    this.tray.setTitle('hoe')
    const trayMenu = this.getContextMenuTemplate()
    this.tray.setContextMenu(trayMenu)
  }

  getContextMenuTemplate() {
    const menuItem = Menu.buildFromTemplate([
      {
        label: 'HostsEditor',
        id: 'HostsEditor',
        type: 'submenu',
        submenu: []
      },
      {
        label: 'Quit',
        id: 'Quit',
        type: 'normal',
        click: () => {
          app.quit()
        }
      }
    ])

    return menuItem
  }

  setContextMenu(type: TraySubmenuType, contextMenu: Electron.Menu) {
    const trayMenu = this.getContextMenuTemplate()
    contextMenu.items.forEach((item) => {
      trayMenu.getMenuItemById(type)?.submenu?.append(item)
    })
    this.tray.setContextMenu(trayMenu)
  }
}

export const trayWrapper = new TrayWrapper()
