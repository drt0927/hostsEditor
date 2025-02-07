import { BaseHandle } from '../baseHandle'
import { fileUtils } from '../../../utils/fileUtils'
import { IpcMainInvokeEvent } from 'electron'

export class HostsHandle extends BaseHandle {
  channel: string = 'hosts'

  GetOriginHosts() {
    return fileUtils.getOriginHosts()
  }

  GetHostsFiles() {
    return fileUtils.getHostsFiles()
  }

  GetCurrentHosts() {
    return fileUtils.getCurrentHosts()
  }

  GetHosts(_event: IpcMainInvokeEvent, name: string) {
    const res = fileUtils.getHosts(name)
    return res
  }

  SetHosts(_event: IpcMainInvokeEvent, name: string) {
    const res = fileUtils.setOriginHosts(name)
    return res
  }

  DeleteHosts(_event: IpcMainInvokeEvent, name: string) {
    const res = fileUtils.deleteHosts(name)
    return res
  }

  CreateHosts(_event: IpcMainInvokeEvent, name: string) {
    const res = fileUtils.createHosts(name)
    return res
  }

  EditHosts(_event: IpcMainInvokeEvent, name: string, txt: string) {
    return fileUtils.editHosts(name, txt)
  }

  // @PrivateProperty()
  // private Test() {
  //   console.log('test')
  // }
}
