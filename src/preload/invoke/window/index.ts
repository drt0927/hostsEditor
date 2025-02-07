import { ipcRenderer } from 'electron'
import { BaseInvoke } from '../baseInvoke'

export class WindowInvoke extends BaseInvoke {
  channel: string = 'window'
  OpenElectronWindow = (url: string): Promise<undefined> =>
    ipcRenderer.invoke(this.GetInvokeKey('OpenElectronWindow'), url)
  OpenShellWindow = (path: string): Promise<undefined> =>
    ipcRenderer.invoke(this.GetInvokeKey('OpenShellWindow'), path)
  ExecuteCommand = (command: string): Promise<undefined> =>
    ipcRenderer.invoke(this.GetInvokeKey('ExecuteCommand'), command)
}
