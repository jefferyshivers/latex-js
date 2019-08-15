# jsTeX

[![js-standard-style](https://img.shields.io/badge/code_style-standard-f7df1e.svg?logo=javascript&logoColor=f7df1e)](https://github.com/standard/standard)

Create compilable [LaTeX](https://www.latex-project.org/) documents in Node

## Example


```js
// project.js
export const base = latex => {
  latex.apply(colors)
}

export const defineColors = latex => {
  const Colors = Object.freeze({
    CYAN: 'Cyan'
  })

  latex.preamble(preamble => {
    preamble.usePackage('table', 'xcolor')
  })

  latex.document(content => {
    content.fragment(`\\definecolor{${Colors.CYAN}}{rgb}{0.6,0.8,0.8}`)
  })

  return Colors
}

import {
  colors,
  base
} from './myCommonStuff'

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
  content.ul(crazyThings)
}

export default project = props => {
  const { coolness, craziness } = props

  const latex = new LaTeX()
  latex.apply(base)
  const Colors = latex.apply(defineColors)

  latex.document(document => {
    document.title(colors.apply(COLORS.BLUE, TITLE))

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
))
```

  => (formatted / compilable LaTeX):

```tex

```

## API
This project is developed in Typescript.

Build the library from source with `yarn` (will also install dependencies), 
or do `yarn build` to rebuild. The output is written to `./build`.

Create and view the docs with `yarn study`.
