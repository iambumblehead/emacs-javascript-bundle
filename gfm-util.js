// Filename: gfm-util.js  
// Timestamp: 2013.07.06-12:17:01 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses gfm (github-flavored-markup): https://github.com/chjj/marked
// 
// `node gfm-util.js -i /path/to/markdownFile.md`

var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    marked = require('marked'),
    input = argv.i || null,
    fileName, fileExtn, baseName,
    fileNameNew, filePathNew, fileTextNew;

marked.setOptions({
  gfm : true,
  breaks : true,
  highlight: function(code, lang) {
    if (lang === 'js') {
      return marked.highlighter.javascript(code);
    }
    return code;
  }
});

if (input) {
  fs.readFile(input, 'utf8', function (err, fd) {
    if (err) return console.log('[!!!] gfm-util: ' + err);

    fileName = input;
    fileExtn = path.extname(fileName);
    baseName = path.basename(fileName, fileExtn);

    fileNameNew = baseName + '.html';
    filePathNew = path.join(path.dirname(input), fileNameNew);

    fileTextNew = marked(fd);    

    if (true) {
      fileTextNew = '' +
        '<html>' +
        '<head>' +
        '<meta content="text/html; charset=utf-8" http-equiv="Content-Type">' +
        '<meta charset="utf-8">' +
        '</head>' + 
        '<body>' +
        fileTextNew +
        '</body>' +
        '</html>';
    }
    
    fs.writeFile(fileNameNew, fileTextNew, function (err) {
      if (err) return console.log('[!!!] gfm-util: ' + err);
      console.log('[mmm] gfm-util: wrote ' + fileNameNew);
    });
  });
}