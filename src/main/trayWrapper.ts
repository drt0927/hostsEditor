import { Tray } from 'electron'
import icon from '../../resources/icon.png?asset'

class TrayWrapper {
  tray!: Tray
  constructor() {
    /*
    const tray = new Tray(icon)

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' },
      { label: 'Item2', type: 'radio' },
      { label: 'Item3', type: 'radio', checked: true },
      { label: 'Item4', type: 'radio' }
    ])
    tray.on('double-click', () => {
      // event.preventDefault()
      mainWindow.show()
    })
    tray.setIgnoreDoubleClickEvents(true)
    tray.setToolTip('This is my application')
    tray.setTitle('This is my title')
    tray.setContextMenu(contextMenu)
    */
  }

  create() {
    this.tray = new Tray(icon)
    this.tray.setIgnoreDoubleClickEvents(true)
    this.tray.setToolTip('This is my application')
    this.tray.setTitle('This is my title')
  }

  setContextMenu(contextMenu: Electron.Menu) {
    this.tray.setContextMenu(contextMenu)
  }
}

export const trayWrapper = new TrayWrapper()
