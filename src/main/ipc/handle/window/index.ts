import { BaseHandle } from '../baseHandle'
import { BrowserWindow, IpcMainInvokeEvent } from 'electron'

export class WindowHandle extends BaseHandle {
  channel: string = 'window'

  async Open(_event: IpcMainInvokeEvent, url: string) {
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      },
      autoHideMenuBar: true
    })
    win.loadURL(url)
  }
}
