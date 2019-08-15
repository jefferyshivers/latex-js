import {
  throws,
  CallbackError
} from '../errors/index'

import {
  seal
} from '../decorators/class'

export type LaTeXContent = LaTeXElement | string | Function | LaTeXContentArray
interface LaTeXContentArray extends Array<LaTeXContent> { }

export type ArgOrOptionContent = Arg | Option | ArgsAndOptionsArray
interface ArgsAndOptionsArray extends Array<ArgOrOptionContent> { }

@seal
export class LaTeXElement {
  private _content: LaTeXContentArray = []

  constructor (content?: LaTeXContent) {
    if (content) {
      this._add(content)
    }
  }

  protected applyUpdate (update: Function, el: LaTeXElement) {
    if (update) {
      throws.typeError(update, Function)

      try {
        update(el)
      } catch (err) {
        throw new CallbackError(err)
      }
    }
  }

  public getContent () {
    return this._content
  }

  protected _add (content: LaTeXContent) {
    if (!Array.isArray(content)) {
      this._content.push(content)
    } else {
      this._content = [...this._content, ...content]
    }
    return this
  }

  public addCommand (command: Command | string) {
    if (command instanceof Command) {
      this._add(command)
    } else {
      this._add(new Command(command))
    }
    return this
  }

  public addOption (option: Option | string) {
    if (option instanceof Option) {
      this._add(option)
    } else {
      this._add(new Option(option))
    }
    return this
  }

  public addArg (arg: Arg | string) {
    if (arg instanceof Arg) {
      this._add(arg)
    } else {
      this._add(new Arg(arg))
    }
    return this
  }

  public addOptions (options: Option[]) {
    this._add(options)
    return this
  }

  public addArgs (args: Arg[]) {
    this._add(args)
    return this
  }

  public addOptionsAndArgs (optionsAndArgs: ArgOrOptionContent) {
    this._add(optionsAndArgs)
    return this
  }

  protected _resolve (content?: LaTeXContent) {
    if (arguments.length === 0) {
      return this._resolve(this._content)
    } else {
      if (content instanceof LaTeXElement) {
        return content._resolve()
      } else if (Array.isArray(content)) {
        return content.map((el) => {
          if (el instanceof LaTeXElement || Array.isArray(el)) {
            return this._resolve(el)
          } else if (typeof el === 'function') {
            return this._resolve(el())
          } else if (typeof el === 'string') {
            return el
          } else {
            console.warn('unresolvable element in contents:', el)
            return ''
          }
        }).join('')
      } else {
        return content
      }
    }
  }
}

export class Command extends LaTeXElement {
  constructor (command: string) {
    super(`\\${command}`)
  }
}

export class Arg extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super(['{', content, '}'])
  }
}

export class Option extends LaTeXElement {
  constructor (option: string) {
    super(['[', option, ']'])
  }
}
