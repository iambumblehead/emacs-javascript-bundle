// Filename: json-parse.js  
// Timestamp: 2013.03.22-19:27:31 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// verify that content of input is valid JSON formatted string.
// 
// `node json-parse.js -i /path/to/jsonFile.json`

var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    input = argv.i || null;

if (input) {
  fs.readFile(input, 'utf-8', function (err, fd) {
    if (err) {
      console.log('[!!!] json-parse: ' + err);
    } else if (JSON.parse(fd)) {
      console.log('[...] json-parse: success');
    } else {
      console.log('[!!!] json-parse: problem parsing file');
    }
  });
}
