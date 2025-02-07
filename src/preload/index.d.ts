import { ElectronAPI } from '@electron-toolkit/preload'
import { InvokeAPI } from './invoke/index'

declare global {
  interface Window {
    electron: ElectronAPI
    api: InvokeAPI
  }
}
