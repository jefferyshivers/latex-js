import {
  LaTeXElement,
  Command,
  Arg,
  Option
} from "./elements";

export{}
const { describe, it } = require('mocha')
const { expect } = require('chai')

// `require`ing the module isn't this awkward in real life
const {
  LaTeX,
  Preamble,
  Document,
  CustomContent
} = require('.')

describe('LaTeX', () => {
  it('contains a Preamble and Document', () => {
    const latex = new LaTeX()

    expect(latex.getContent().length).to.equal(2)
    expect(latex.getContent()[0]).to.be.an.instanceOf(Preamble)
    expect(latex.getContent()[1]).to.be.an.instanceOf(Document)
  })

  describe('preamble', () => {
    it('returns the Preamble instance', () => {
      const latex = new LaTeX()
      expect(latex.preamble()).to.be.an.instanceOf(Preamble)
    })

    it('takes a function that can apply changes to the Preamble instance', () => {
      const latex = new LaTeX()

      const previousLength = latex.preamble().getPackages().length

      latex.preamble(preamble => {
        expect(preamble).to.equal(latex.preamble())
        preamble.usePackage('foo')
      })

      expect(latex.preamble().getPackages().length).to.equal(previousLength + 1)
    })
  })

  describe('document', () => {
    it('returns the custom Document content', () => {
      const latex = new LaTeX()
      expect(latex.document()).to.be.an.instanceOf(CustomContent)
    })

    it('takes a function that can apply changes to the custom document content', () => {
      const latex = new LaTeX()
      const previousLength = latex.document().getContent().length

      latex.document(document => {
        expect(document).to.equal(latex.document())
        document.par('foo')
      })

      expect(latex.document().getContent().length).to.equal(previousLength + 1)
    })
  })
})

describe('Preamble', () => {
  it('contains initial props', () => {
    const latex = new LaTeX()
    const preamble = latex.preamble()

    expect(preamble.getContent().length).to.equal(4)
    expect(preamble.getContent()[0]).to.be.an.instanceOf(LaTeXElement)
    expect(preamble.getContent()[1]).to.be.an.instanceOf(Array)
    expect(preamble.getContent()[2]).to.be.an.instanceOf(Function)
    expect(preamble.getContent()[3]).to.be.an.instanceOf(CustomContent)
  })

  describe('usePackage', () => {
    const USE_PKG = '\\usepackage'

    it('adds a package import to the Preamble', () => {
      const latex = new LaTeX()
      const preamble = latex.preamble()

      const PKG_NAME = 'foo'

      preamble.usePackage(PKG_NAME)
      expect(preamble.getPackages().length).to.equal(1)

      const pkg = preamble.getPackages()[0]

      const cmd = pkg.getContent()[0]
      expect(cmd).to.be.an.instanceOf(Command)
      expect(cmd.getContent()).to.contain(USE_PKG)

      const arg = pkg.getContent()[1]
      expect(arg).to.be.an.instanceOf(Arg)
      expect(arg.getContent()).to.contain(PKG_NAME)
    })

    it('adds a package import with options to the Preamble', () => {
      const latex = new LaTeX()
      const preamble = latex.preamble()

      const OPTION_TEXT = 'margin=0.5in'
      const PKG_NAME = 'geometry'

      preamble.usePackage(OPTION_TEXT, PKG_NAME)
      expect(preamble.getPackages().length).to.equal(1)

      const pkg = preamble.getPackages()[0]

      const cmd = pkg.getContent()[0]
      expect(cmd).to.be.an.instanceOf(Command)
      expect(cmd.getContent()).to.contain(USE_PKG)

      const option = pkg.getContent()[1]
      expect(option).to.be.an.instanceOf(Option)
      expect(option.getContent()).to.contain(OPTION_TEXT)

      const arg = pkg.getContent()[2]
      expect(arg).to.be.an.instanceOf(Arg)
      expect(arg.getContent()).to.contain(PKG_NAME)
    })

  })
})
