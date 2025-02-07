import 'reflect-metadata'

export abstract class BaseHandle implements IBaseHandle {
  abstract channel: string
  GetChannelKey = (key: string) => `${this.channel}:${key}`
}

export function PrivateProperty() {
  return function (_target: object, _propertyKey: PropertyKey, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata('isPrivate', true, descriptor.value)
  }
}

export interface IBaseHandle {
  channel: string
  GetChannelKey(key: string): string
}
