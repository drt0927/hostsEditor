import { ipcRenderer } from 'electron'
import { BaseInvoke } from '../baseInvoke'

export class HostsInvoke extends BaseInvoke {
  channel: string = 'hosts'
  GetOriginHosts = (): Promise<{ txt: string; path: string }> =>
    ipcRenderer.invoke(this.GetInvokeKey('GetOriginHosts'))
  GetHostsFiles = (): Promise<string[]> => ipcRenderer.invoke(this.GetInvokeKey('GetHostsFiles'))
  GetCurrentHosts = (): Promise<{ txt: string; path: string; name: string } | undefined> =>
    ipcRenderer.invoke(this.GetInvokeKey('GetCurrentHosts'))
  GetHosts = (name: string): Promise<{ txt: string; path: string }> =>
    ipcRenderer.invoke(this.GetInvokeKey('GetHosts'), name)
  SetHosts = (name: string): Promise<{ success: boolean; error?: Error }> =>
    ipcRenderer.invoke(this.GetInvokeKey('SetHosts'), name)
  DeleteHosts = (name: string): Promise<{ success: boolean; error?: Error }> =>
    ipcRenderer.invoke(this.GetInvokeKey('DeleteHosts'), name)
  CreateHosts = (name: string): Promise<{ success: boolean; error?: Error }> =>
    ipcRenderer.invoke(this.GetInvokeKey('CreateHosts'), name)
  EditHosts = (name: string, txt: string): Promise<{ success: boolean; error?: Error }> =>
    ipcRenderer.invoke(this.GetInvokeKey('EditHosts'), name, txt)
}
