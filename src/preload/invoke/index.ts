import { HostsInvoke } from './hosts'
import { PingInvoke } from './ping'
import { SearchInvoke } from './search'
import { WindowInvoke } from './window'

export class InvokeAPI {
  hostsInvoke = new HostsInvoke()
  pingInvoke = new PingInvoke()
  searchInvoke = new SearchInvoke()
  windowInvoke = new WindowInvoke()
}
