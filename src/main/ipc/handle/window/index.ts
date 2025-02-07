import { exec } from 'child_process'
import { BaseHandle } from '../baseHandle'
import { BrowserWindow, IpcMainInvokeEvent, shell } from 'electron'

export class WindowHandle extends BaseHandle {
  channel: string = 'window'

  async OpenElectronWindow(_event: IpcMainInvokeEvent, url: string) {
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

  async OpenShellWindow(_event: IpcMainInvokeEvent, path: string) {
    shell.openPath(path)
  }

  async ExecuteCommand(_event: IpcMainInvokeEvent, command: string) {
    exec(command)
  }
}
