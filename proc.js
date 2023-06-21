const fs = require('fs')

const [_node, _self, input] = process.argv

const notebook = JSON.parse(fs.readFileSync(input))

function *extractColabMarkdown(cells) {
  for (const cell of cells) {
    if (cell.cell_type !== 'code') {
      yield cell
      continue
    }
    const md = codeMarkdown(cell)
    if (md.length) {
      yield { cell_type: 'markdown', source: md, metadata: {} }
      yield { ...cell, metadata: {...cell.metadata, folded: true}}
    } else {
      yield cell
    }
  }
}

function *removeWidgetOutput(cells) {
  for (const cell of cells) {
    if (!cell.outputs) { yield cell; continue }
    for (const out of cell.outputs) {
      if (!out.data) continue
      if (out.data['application/vnd.jupyter.widget-view+json']) {
        delete out.data['text/plain']
      }
    }
    yield cell
  }
}

function pipe(...generators) {
  return function(...input) {
    return generators.reduce((input, gen) => [gen.apply(this, input)], input)[0]
  }
}

const MD_LINE = /^#@(title|markdown)(.*)/
function codeMarkdown(cell) {
  const md = []
  for (const line of cell.source) {
    const match = MD_LINE.exec(line)
    if (!match) continue
    const [_full, kind, src] = match
    if (kind === 'title') {
      md.push('#### ' + src + '\n')
      md.push('\n')
    } else {
      md.push(src + '\n')
    }
  }
  return md
}


process.stdout.write(JSON.stringify({
  ...notebook,
  cells: [...pipe(extractColabMarkdown, removeWidgetOutput)(notebook.cells)]
}))