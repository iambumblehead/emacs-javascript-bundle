// Filename: vdom-util.js
// Timestamp: 2015.06.07-17:02:23 (last modified)
// Author(s): Bumblehead (www.bumblehead.com)

import fs from 'node:fs'
import path from 'node:path'

import beautify from 'js-beautify'
import compile from 'html2hyperscript'
import argvparse from './argvparse.js'

const input = argvparse(process.argv, 'i')

function readFile (fpath, fn) {
  fs.readFile(fpath, 'utf8', fn)
}

function getMatchedFilenameExtn (ogfilename, newextn) {
  const dir = path.dirname(ogfilename)
  const extn = path.extname(ogfilename)
  const name = path.basename(ogfilename, extn)
  const namehtml = name + '.' + newextn

  return path.join(dir, namehtml)
}

function writeMUSTACHEtoVDOMjs (mustachefilepath, fn) {
  readFile(mustachefilepath, (err, res) => {
    if (err) return fn(err)

    const pathjs = getMatchedFilenameExtn(mustachefilepath, 'vdom.js')
    const hnode = beautify(compile(res), { indent_size: 2 })

    fs.writeFile(pathjs, hnode, err => {
      if (err) return fn(err)

      fn(null, path.basename(pathjs))
    })
  })
}

writeMUSTACHEtoVDOMjs(input, (err, vdomjs) => {
  if (err) {
    console.log('[!!!] vdom-util: ' + err)
  } else {
    console.log('[mmm] vdom-util: wrote ' + vdomjs)
  }
})

