import { ipcMain } from 'electron'
import { HostsHandle } from './handle/hosts'
import { IBaseHandle } from './handle/baseHandle'
import { PingHandle } from './handle/ping'
import 'reflect-metadata'
import { SearchHandle } from './handle/search'
import { WindowHandle } from './handle/window'

class HandleWrapper {
  static bind<T extends IBaseHandle>(type: { new (): T }) {
    const handle = new type()
    const methods = Object.getOwnPropertyNames(type.prototype).filter((x) => x !== 'constructor')
    for (const m of methods) {
      const isPrivate = Reflect.getMetadata('isPrivate', handle[m])
      if (!isPrivate) {
        ipcMain.handle(handle.GetChannelKey(m), handle[m])
        console.info(`ipcMain Handle Bind :: ${handle.GetChannelKey(m)}`)
      }
    }
  }
}

export function bindHandle() {
  HandleWrapper.bind(HostsHandle)
  HandleWrapper.bind(PingHandle)
  HandleWrapper.bind(SearchHandle)
  HandleWrapper.bind(WindowHandle)
}
