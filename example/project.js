const base = latex => {
  const Colors = latex.apply(defineColors)
  return { Colors }
}

const defineColors = latex => {
  const Colors = Object.freeze({ CYAN: 'Cyan' })
  latex.preamble(preamble => preamble.usePackage('table', 'xcolor'))
  latex.document(content => content.fragment(`\\definecolor{${Colors.CYAN}}{rgb}{0.6,0.8,0.8}`))
  return Colors
}

const {
  LaTeX,
  elements: { Environment }
} = require('latex-js')

const coolSection = content => {
  content.section('My Cool Project')
  content.par(`Let me tell you about my project.`)
}

const crazySection = crazyThings => content => {
  content.section('Crazy Things')
  section.ul(crazyThings)
}

const project = props => {
  const { coolness, craziness } = props

  const latex = new LaTeX()
  const template = latex.apply(base)

  latex.document(document => {
    document.title("HI")
    // document.title(colors.apply(COLORS.BLUE, TITLE))

    const flushleft = new Environment('flushleft')
    document.environment(flushleft, content => {
      content.apply(coolSection)
      craziness && content.apply(crazySection(craziness))
    })
  })

  return latex.output()
}

console.log(project({
  coolness: true,
  craziness: ['foo', 'bar']
}))
