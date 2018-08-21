// Filename: vdom-util.js  
// Timestamp: 2015.06.07-17:02:23 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)

var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    exec = require('child_process').exec,
    input = argv.i || null,
    beautify = require('js-beautify').js_beautify,
    
    compile = require('html2hyperscript');

function readFile (fpath, fn) {
  fs.readFile(fpath, 'utf8', fn);
}

function getMatchedFilenameExtn (ogfilename, newextn) {
  var dir = path.dirname(ogfilename),
      extn = path.extname(ogfilename),
      name = path.basename(ogfilename, extn),
      namehtml = name + '.' + newextn;

  return path.join(dir, namehtml);
}

function writeMUSTACHEtoVDOMjs (mustachefilepath, fn) {
  readFile(mustachefilepath, function (err, res) {
    if (err) return fn(err);

    var pathjs = getMatchedFilenameExtn(mustachefilepath, 'vdom.js'),
        hnode = beautify(compile(res), { indent_size: 2 });
    
    fs.writeFile(pathjs, hnode, function (err) {
      if (err) return fn(err);
      
      fn(null, path.basename(pathjs));
    });
  });
}

if (require.main === module && input) {
  writeMUSTACHEtoVDOMjs(input, function (err, vdomjs) {
    if (err) {
      console.log('[!!!] vdom-util: ' + err);
    } else {
      console.log('[mmm] vdom-util: wrote ' + vdomjs);
    }
  });
}

