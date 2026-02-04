// verify that content of input is valid JSON formatted string.
//
// `node json-parse.js -i /path/to/jsonFile.json`
//
import fs from 'node:fs/promises'
import argvparse from './argvparse.js'

const inputpath = argvparse(process.argv, 'i')
const inputurl = inputpath && new URL(inputpath, import.meta.url)

if (inputurl) {
  JSON.parse(await fs.readFile(inputurl, 'utf-8'))

  console.log('[...] json-parse: success')
}
