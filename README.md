# jsTeX

[![js-standard-style](https://img.shields.io/badge/code_style-standard-f7df1e.svg?logo=javascript&logoColor=f7df1e)](https://github.com/standard/standard)

Create compilable [LaTeX](https://www.latex-project.org/) documents in Node

## Example

```js
const { LaTeX, elements: { Environment } } = require('latex-js')

const latex = new LaTeX()

latex.document(document => {
  document.title('My Great Project')

  const flushleft = new Environment('flushleft')
  document.environment(flushleft, content => {
    content.section('Introduction')
    content.par('lots of stuff...')
  })
})

const output = latex.output()
```
outputs the following:
```tex
\documentclass[10pt]{article}
\title{My Great Project}
\begin{document}
\maketitle
\begin{flushleft}
\section{Introduction}
\par lots of stuff...
\end{flushleft}
\end{document}
```

## API
This project is developed in Typescript.

Build the library from source with `yarn` (will also install dependencies), 
or do `yarn build` to rebuild. The output is written to `./build`.

Create and view the docs with `yarn study`.
