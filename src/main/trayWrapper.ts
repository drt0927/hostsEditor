import { app, BrowserWindow, dialog, Menu, Tray } from 'electron'
import icon from '../../resources/icon.png?asset'
import { fileUtils } from './utils/fileUtils'
export type TraySubmenuType = 'HostsEditor' | 'Quit'

class TrayWrapper {
  tray!: Tray
  create(window: BrowserWindow) {
    this.tray = new Tray(icon)
    this.tray.setIgnoreDoubleClickEvents(true)
    this.tray.setTitle('hoe')
    this.tray.on('double-click', () => {
      window.show()
    })
    this.SetTrayMenu()
  }

  destroy() {
    this.tray?.destroy()
  }

  SetTrayMenu() {
    const list = fileUtils.getHostsFiles()
    const menu = Menu.buildFromTemplate(
      list.map((item) => {
        const currentHosts = fileUtils.getCurrentHosts()
        return {
          label: item,
          type: 'radio',
          checked: item === currentHosts?.name,
          click: async () => {
            const win: BrowserWindow | null =
              BrowserWindow.getAllWindows().length > 0
                ? BrowserWindow.getAllWindows()[0]
                : new BrowserWindow()
            const res = await dialog.showMessageBox(win, {
              type: 'question',
              title: 'hosts 변경',
              message: `hosts 파일을 [${currentHosts?.name}] -> [${item}]로 변경하시겠습니까?`,
              cancelId: 1,
              buttons: ['적용', '취소']
            })

            if (res.response === 0) {
              const setResult = await fileUtils.setOriginHosts(item)
              if (setResult.success) {
                win?.webContents.send('on-hosts-change', item)
                await dialog.showMessageBox(win, {
                  type: 'info',
                  title: 'hosts 변경',
                  message: 'hosts 파일이 변경되었습니다.'
                })
              } else {
                this.SetTrayMenu()
                await dialog.showMessageBox(win, {
                  type: 'error',
                  title: 'hosts 변경',
                  message: 'hosts 파일 변경에 실패하였습니다.'
                })
              }
            } else {
              this.SetTrayMenu()
            }
          }
        }
      })
    )

    trayWrapper.setContextMenu('HostsEditor', menu)
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
