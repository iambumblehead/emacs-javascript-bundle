// Filename: json-parse.js  
// Timestamp: 2013.03.22-19:27:31 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// verify that content of input is valid JSON formatted string.
// 
// `node json-parse.js -i /path/to/jsonFile.json`

import fs from 'node:fs'
import path from 'node:path'
const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]
if (typeof input !== 'string') {
  throw new Error('input must be a path (string)');
}

if (input) {
  fs.readFile(input, 'utf-8', (err, fd) => {
    if (err) {
      console.log('[!!!] json-parse: ' + err);
    } else if (JSON.parse(fd)) {
      console.log('[...] json-parse: success');
    } else {
      console.log('[!!!] json-parse: problem parsing file');
    }
  })
}
