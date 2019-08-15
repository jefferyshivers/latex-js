/* eslint-disable no-unused-vars */
import { LaTeXElement, Arg, Command, LaTeXContent } from './element'
/* eslint-disable no-unused-vars */

/**
 * a redundant class exposed in the API to hide some protected functions in the
 * base class
 */
export class Fragment extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super(content)
  }
}

export class Title extends LaTeXElement {
  _text: Arg

  constructor (text?: string) {
    super()

    this._text = new Arg(text)

    this._add([
      new Command('title'),
      this._text
    ])
  }

  public getText () {
    return this._text
  }

  public setText (text: LaTeXContent) {
    this._text = new Arg(text)
  }

  public setup () {
    return () => {
      if (this._text) {
        return [new Command('title'), this._text]
      }
    }
  }

  public make () {
    return () => {
      if (this._text) {
        return new Command('maketitle')
      }
    }
  }
}

export class Section extends LaTeXElement {
  constructor (text: string) {
    super([new Command('section'), new Arg(text)])
  }
}

export class Par extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super([
      new Command('par'),
      ' ', // to space like: `\par foo`
      content
    ])
  }
}

export class Underline extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super([new Command('underline'), new Arg(content)])
  }
}

export class Bold extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super([new Command('textbf'), new Arg(content)])
  }
}

export class Italic extends LaTeXElement {
  constructor (content: LaTeXContent) {
    super([new Command('textit'), new Arg(content)])
  }
}
