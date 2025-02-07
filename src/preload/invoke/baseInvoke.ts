export abstract class BaseInvoke implements IBaseInvoke {
  abstract channel: string
  GetInvokeKey = (key: string) => `${this.channel}:${key}`
}

export interface IBaseInvoke {
  channel: string
  GetInvokeKey(key: string): string
}
