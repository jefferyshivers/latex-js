import { Class } from '../generics/index'

// NOTE we explicitly have to assign `this.prototype` to each customer error because: 
// https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work

export class LaTeXError extends Error {
  name = 'LaTeXError'
  constructor (message?: string) {
    super(message)
  }
}

export class TypeError extends LaTeXError {
  name = 'TypeError'
  constructor (arg: any, acceptedTypes: Class | Class[]) {    
    super(
      `Expected object ${arg} to be `
      + `${Array.isArray(acceptedTypes)
        ? `one of types: (${acceptedTypes.join(', ')})`
        : `of type ${acceptedTypes}`}`)
    Object.setPrototypeOf(this, TypeError.prototype)
  }
}

export class CallbackError extends LaTeXError {
  name = 'CallbackError'
  constructor (caught: Error) {
    super(caught.message)
    this.stack = caught.stack
    Object.setPrototypeOf(this, CallbackError.prototype)
  }
}
