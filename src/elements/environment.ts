/* eslint-disable no-unused-vars */
import { LaTeXElement, Command, ArgOrOptionContent } from './element'
/* eslint-disable no-unused-vars */

import {
  seal
} from '../decorators/class'

/**
 * An Environment describes the context in which inner content will expand.
 *
 * It doesn't however, _contain_ that content. Use the [[Begin]] and [[End]] objects
 * to create the bounds of an `Environment`.
 *
 * ```js
 * const document = new Environment('document')
 *
 * const tabular = new Environment('tabular', new Arg('|l|c|r|'))
 * ```
 */
@seal
export class Environment extends LaTeXElement {
  private _name: string

  constructor (name: string, modifiers?: ArgOrOptionContent) {
    super()

    this._name = name

    if (modifiers) {
      this.addOptionsAndArgs(modifiers)
    }
  }

  public getName () {
    return this._name
  }
}

/**
 * Can be constructed from scratch, but best created from an `Environment`.
 */
export class Begin extends LaTeXElement {
  constructor (envOrName: Environment | string) {
    super(new Command('begin'))

    if (envOrName instanceof Environment) {
      this.addArg(envOrName.getName())
      this._add(envOrName.getContent())
    } else {
      this.addArg(envOrName)
    }
  }
}

/**
 * Can be constructed from scratch, but best created from an `Environment`.
 */
export class End extends LaTeXElement {
  constructor (envOrName: Environment | string) {
    super(new Command('end'))

    if (envOrName instanceof Environment) {
      this.addArg(envOrName.getName())
    } else {
      this.addArg(envOrName)
    }
  }
}
