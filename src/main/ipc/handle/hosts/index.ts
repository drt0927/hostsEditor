import { BaseHandle } from '../baseHandle'
import { fileUtils } from '../../../utils/fileUtils'
import { BrowserWindow, dialog, IpcMainInvokeEvent, Menu } from 'electron'
import { trayWrapper } from '../../../trayWrapper'

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

  SetTrayMenu(_event: IpcMainInvokeEvent) {
    const list = fileUtils.getHostsFiles()
    const menu = Menu.buildFromTemplate(
      list.map((item) => {
        const currentHosts = fileUtils.getCurrentHosts()
        return {
          label: item,
          type: 'radio',
          checked: item === currentHosts?.name,
          click: async () => {
            const win = BrowserWindow.fromWebContents(_event.sender)
            if (win) {
              const res = await dialog.showMessageBox(win, {
                type: 'question',
                title: 'hosts 변경',
                message: `hosts 파일을 [${currentHosts?.name}] -> [${item}]로 변경하시겠습니까?`,
                cancelId: 1,
                buttons: ['적용', '취소']
              })
              if (res.response === 0) {
                fileUtils.setOriginHosts(item)
                _event.sender.send('on-hosts-change', item)
              }
            }
          }
        }
      })
    )

    trayWrapper.setContextMenu(menu)
  }

  // @PrivateProperty()
  // private Test() {
  //   console.log('test')
  // }
}
