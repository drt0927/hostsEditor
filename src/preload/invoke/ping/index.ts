import { ipcRenderer } from 'electron'

export class PingInvoke {
  ping = (): Promise<string> => ipcRenderer.invoke('ping:ping')
}
