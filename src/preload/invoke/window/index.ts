import { ipcRenderer } from 'electron'
import { BaseInvoke } from '../baseInvoke'

export class WindowInvoke extends BaseInvoke {
  channel: string = 'window'
  Open = (url: string): Promise<undefined> => ipcRenderer.invoke(this.GetInvokeKey('Open'), url)
}
