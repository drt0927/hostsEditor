import { ipcRenderer } from 'electron'
import { BaseInvoke } from '../baseInvoke'

export class SearchInvoke extends BaseInvoke {
  channel: string = 'search'
  Search = (
    word: string,
    matchCase: boolean,
    dir: boolean,
    reset: boolean
  ): Promise<{
    requestId: number
    activeMatchOrdinal: number
    matches: number
    selectionArea: unknown
    finalUpdate: boolean
  }> => ipcRenderer.invoke(this.GetInvokeKey('Search'), word, matchCase, dir, reset)
  SearchStop = (): Promise<undefined> => ipcRenderer.invoke(this.GetInvokeKey('SearchStop'))
}
