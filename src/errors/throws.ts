import { Class } from '../generics/index'
import { TypeError } from '../errors/index'

export const typeError = <T> (arg: any, acceptedTypes: Class | Class<T> | Class<T>[]) => {
  const argIsType = <T> (type: Class | Class<T>) => {
    return arg.constructor.name === type.name
  }

  if (!Array.isArray(acceptedTypes)) {
    if (!argIsType(acceptedTypes)) {
      throw new TypeError(arg, acceptedTypes)
    }
  } else {
    if (!acceptedTypes.find(type => argIsType(type))) {
      throw new TypeError(arg, acceptedTypes)
    }
  }
}
