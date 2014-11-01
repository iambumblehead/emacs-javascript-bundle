// Filename: gfm-util.js  
// Timestamp: 2014.11.01-08:56:03 (last modified)  
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
    fileNameNew, filePathNew, fileTextNew,
    stylesheetElem, dirname, 
    baseNameCSS,
    baseNameHTML,
    pathfullCSS, 
    pathfullHTML, 
    isCSS;

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
    dirname = path.dirname(input);
    baseNameCSS = baseName + '.css';
    baseNameHTML = baseName + '.html';
    pathfullCSS = path.join(dirname, baseNameCSS);
    pathfullHTML = path.join(dirname, baseNameHTML);

    fs.stat(pathfullCSS, function(err, stat) {
      isCSS = stat && stat.isFile();

      fileNameNew = baseName + '.html';
      filePathNew = path.join(path.dirname(input), fileNameNew);

      fileTextNew = marked(fd);    
      fileTextNew = '' +
        '<html>' +
        '  <head>' +
        '    <meta content="text/html" charset="utf-8" http-equiv="Content-Type">' +
        '    <meta charset="utf-8">' + (isCSS ? 
        '    <link rel="stylesheet" type="text/css" href="./:baseName">'
             .replace(/:basename/gi, baseNameCSS) : '') +
        '  </head>' + 
        '  <body>' +
        fileTextNew +
        '  </body>' +
        '</html>';
      
      fs.writeFile(fileNameNew, fileTextNew, function (err) {
        if (err) return console.log('[!!!] gfm-util: ' + err);
        console.log('[mmm] gfm-util: wrote ' + fileNameNew);
      });

    });

  });
}
