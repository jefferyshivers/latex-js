import {
  LaTeXElement,
  LaTeXContent,
  Command,
  Arg,
  Option,
  Fragment,
  Section,
  Par,
  Title,
  Underline,
  Bold,
  Italic,
  Environment,
  Begin,
  End
} from './elements/index'

import {
  required,
  type
} from './decorators/parameter'

import {
  seal
} from './decorators/class'

/**
 * objects provided to add custom content to the Preamble and Document
 */
@seal
export class CustomContent extends LaTeXElement {
  private _setTitle: Function

  constructor (title?: Title) {
    super()
    Object.setPrototypeOf(this, CustomContent.prototype)

    if (title) {
      this._setTitle = title.setText.bind(title)
    }
  }

  public title (text: LaTeXContent) {
    this._setTitle(text)
    return this
  }

  public add (content: LaTeXContent) {
    this._add(content)
    return this
  }

  public apply (
    @required(Function) update: Function
  ) {
    this.applyUpdate(update, this)
    return this
  }

  public section (titleOrContent: string | Section) {
    if (typeof titleOrContent === 'string') {
      this._add(new Section(titleOrContent))
    } else if (titleOrContent instanceof Section) {
      this._add(titleOrContent)
    }
    return this
  }

  public par (content: string | Par) {
    if (typeof content === 'string') {
      this._add(new Par(content))
    } else if (content instanceof Par) {
      this._add(content)
    }
    return this
  }

  public bold (content: string) {
    this._add(new Bold(content))
  }

  public italic (content: string) {
    this._add(new Italic(content))
  }

  public environment (
    @required() environment: Environment | string,
    @type(Function) update?: Function
  ) {
    if (typeof environment === 'string') {
      environment = new Environment(environment)
    }

    const content = new CustomContent()

    this.applyUpdate(update, content)

    this._add([new Begin(environment), content, new End(environment)])

    return content
  }

  public begin (initialArgOrBegin: string | Begin | Environment) {
    if (initialArgOrBegin instanceof Begin) {
      this._add(initialArgOrBegin)
    } else {
      this._add(new Begin(initialArgOrBegin))
    }
    return this
  }

  public end (initialArgOrEnd: string | End | Environment) {
    if (initialArgOrEnd instanceof End) {
      this._add(initialArgOrEnd)
    } else {
      this._add(new End(initialArgOrEnd))
    }
    return this
  }

  public fragment (content: string) {
    this._add(new Fragment(content))
  }
}

@seal
export class Preamble extends LaTeXElement {
  _documentClassDeclaration: LaTeXElement
  _packages: LaTeXElement[] = []
  _setTitle: Function
  _custom: CustomContent

  constructor (title: Title) {
    super()
    Object.setPrototypeOf(this, Preamble.prototype)  

    this._documentClassDeclaration = new LaTeXElement([
      new Command('documentclass'),
      new Option('10pt'),
      new Arg('article')
    ])

    this._setTitle = title.setText.bind(title)

    this._custom = new CustomContent()

    this._add([
      this._documentClassDeclaration,
      this._packages,
      title.setup(),
      this._custom
    ])
  }

  public add (content: LaTeXContent) {
    this.getCustomContent().add(content)
  }

  public getCustomContent () {
    return this._custom
  }

  public getPackages () {
    return this._packages
  }

  public usePackage (packageNameOrOptions: string, packageName?: string) {
    const pkg = [new Command('usepackage')]

    if (packageName) {
      pkg.push(new Option(packageNameOrOptions))
      pkg.push(new Arg(packageName))
    } else {
      pkg.push(new Arg(packageNameOrOptions))
    }

    this._packages.push(new LaTeXElement(pkg))
    return this
  }

  public title (text: string) {
    this._setTitle(text)
    return this
  }
}

@seal
export class Document extends LaTeXElement {
  private _custom: CustomContent

  constructor (title: Title) {
    super()
    Object.setPrototypeOf(this, Document.prototype)

    this._custom = new CustomContent(title)

    const document = new Environment('document')

    this._add([
      new Begin(document),
      title.make(),
      this._custom,
      new End(document)
    ])
  }

  public getCustomContent () {
    return this._custom
  }
}

/**
 * base class for constructing LaTeX document
 */
@seal
export class LaTeX extends LaTeXElement {
  private _preamble: Preamble
  private _document: Document
  private _title: Title

  constructor () {
    super()
    
    this._title = new Title()
    this._preamble = new Preamble(this._title)
    this._document = new Document(this._title)
    this._add([this._preamble, this._document])
  }

  public apply (
    @required(Function) update: Function
  ) {
    this.applyUpdate(update, this)
    return this
  }

  public getTitle () {
    return this._title
  }

  public preamble (
    @type(Function) update?: Function
  ) {
    this.applyUpdate(update, this._preamble)
    return this._preamble
  }

  public document (
    @type(Function) update?: Function
  ) {
    this.applyUpdate(update, this._document.getCustomContent())
    return this._document.getCustomContent()
  }

  public output () {
    return this.getContent()
      .map(this._resolve)
      .join('')
  }
}

export default {
  LaTeX,
  elements: {
    Command,
    Arg,
    Option,
    Fragment,
    Section,
    Par,
    Title,
    Underline,
    Bold,
    Italic,
    Environment
  }
}
