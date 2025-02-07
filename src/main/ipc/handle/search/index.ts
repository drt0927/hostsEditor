import { BaseHandle } from '../baseHandle'
import { IpcMainInvokeEvent } from 'electron'

export class SearchHandle extends BaseHandle {
  channel: string = 'search'

  async Search(
    event: IpcMainInvokeEvent,
    word: string,
    matchCase: boolean,
    dir: boolean,
    reset: boolean
  ) {
    if (!word) {
      return
    }

    return new Promise((resolve) => {
      event.sender.findInPage(word, {
        matchCase: matchCase,
        forward: dir,
        findNext: reset
      })

      event.sender.on('found-in-page', (_event, result) => {
        resolve(result)
      })
    })
  }

  SearchStop(event: IpcMainInvokeEvent) {
    event.sender.stopFindInPage('activateSelection')
  }
}
