import { BaseHandle } from '../baseHandle'

export class PingHandle extends BaseHandle {
  channel: string = 'ping'

  ping() {
    console.log('pong')
    return 'pong'
  }
}
