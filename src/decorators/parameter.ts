import 'reflect-metadata'

import { Class } from '../generics/index'
import { throws } from '../errors/index'

const REQUIRED = 'REQUIRED'

/**
 * helper class for validation rules on class method parameters
 */
class Validation {
  private _paramaterIndex: Number
  private _validate: Function

  constructor (parameterIndex: Number, validation: Function) {
    this._paramaterIndex = parameterIndex
    this._validate = validation
  }

  getParameterIndex () {
    return this._paramaterIndex
  }

  getValidation () {
    return this._validate
  }
}

const addValidation = (target: Object, propertyKey: string | symbol, validation: Validation) => {
  let existingRequiredParameters: Validation[] = Reflect.getOwnMetadata(REQUIRED, target, propertyKey) || [];
  existingRequiredParameters.push(validation);
  Reflect.defineMetadata(REQUIRED, existingRequiredParameters, target, propertyKey);
}

export const validate = (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) => {
  const method = descriptor.value

  descriptor.value = function () {
    const validations: Validation[] = Reflect.getOwnMetadata(REQUIRED, target, propertyName)

    if (validations) {
      for (let validation of validations) {
        validation.getValidation()
      }
    }

    return method.apply(this, arguments)
  }
}

/**
 * class method parameter decorator
 */
export const required = <T> (types?: Class | Class<T> | Class<T>[]) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
  addValidation(target, propertyKey, new Validation(parameterIndex, () => {
    if (target === undefined || target === null) {
      throw new Error('required parameter is missing')
    } else if (type) {
      throws.typeError(target, types)
    }
  }));
}

/**
 * class method parameter decorator
 */
export const type = <T> (types: Class | Class<T> | Class<T>[]) => (target: Object, propertyKey: string | symbol, parameterIndex: number) => {
  addValidation(target, propertyKey, new Validation(parameterIndex, () => {
    if (target !== null) {
      throws.typeError(target, types)
    }
  }));
}
