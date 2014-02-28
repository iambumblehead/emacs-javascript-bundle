// Filename: pdf-util.js  
// Timestamp: 2014.02.24-22:54:13 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses pdf (github-flavored-markup): https://github.com/chjj/marked
// 
// `node pdf-util.js -i /path/to/markdownFile.md`
//
// to use this, you'll need the wkhtmltopdf binary,
// http://wkhtmltopdf.org/

var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    marked = require('marked'),
    exec = require('child_process').exec,
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
    if (err) return console.log('[!!!] pdf-util: ' + err);

    fileName = input;
    fileExtn = path.extname(fileName);
    baseName = path.basename(fileName, fileExtn);

    fileNameNew = baseName + '.html';
    filePathNew = path.join(path.dirname(input), fileNameNew);

    fileTextNew = marked(fd);    

    if (true) {
      fileTextNew = '' +
        '<html>' +
        '  <head>' +
        '    <meta content="text/html" charset="utf-8" http-equiv="Content-Type">' +
        '    <meta charset="utf-8">' +
        '    <link rel="stylesheet" type="text/css" href="./:baseName.css">' +
        '  </head>' + 
        '  <body>' +
        fileTextNew +
        '  </body>' +
        '</html>';

      fileTextNew = fileTextNew.replace(/:baseName/, baseName);
    }
    
    fs.writeFile(fileNameNew, fileTextNew, function (err) {
      if (err) return console.log('[!!!] pdf-util: ' + err);

      var fileNameNewPDF = fileNameNew.replace(/html/, 'pdf');
      var wkhtmltopdfbin = '~/Software/wkhtmltox/bin/wkhtmltopdf';

      console.log('[mmm] gfm-util: wrote ' + fileNameNew);

      return exec(wkhtmltopdfbin + ' ' + fileNameNew + ' ' + fileNameNewPDF, function(err, stdout, stderr) {
        if (err) return console.log('Error writing pdf: ' + err);

        console.log('[mmm] pdf-util: wrote ' + fileNameNewPDF);
      });      


    });
  });
}
