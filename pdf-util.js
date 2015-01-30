// Filename: pdf-util.js  
// Timestamp: 2015.01.30-12:40:17 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses pdf (github-flavored-markup): https://github.com/chjj/marked
// 
// `node pdf-util.js -i /path/to/markdownFile.md`
//
// to use this, you'll need the wkhtmltopdf binary,
// http://wkhtmltopdf.org/

var argv = require('optimist').argv,
    exec = require('child_process').exec,
    input = argv.i || null,
    gfmutil = require('./gfm-util.js');

function writeMDtoPDF (mdfilepath, fn) {
  gfmutil.writeMDtoHTML(mdfilepath, function (err, namehtml) {
    if (err) return fn(err);

      var namepdf = namehtml.replace(/html/, 'pdf'),
          wkhtmltopdfbin = '~/Software/wkhtmltox/bin/wkhtmltopdf';

      return exec(wkhtmltopdfbin + ' ' 
      + '--print-media-type ' 
      + '--page-size letter '
      + '--run-script \'document.body.className="pdf";\' ' 
      + '--margin-left 0mm --margin-right 0mm --margin-top 0mm ' 
      + namehtml + ' ' + namepdf, function(err, stdout, stderr) {
        if (err) return console.log('Error writing pdf: ' + err);

        console.log('[mmm] pdf-util: wrote ' + namepdf);
      });      
  });
}

if (input) {
  writeMDtoPDF(input, function (err, namepdf) {
    if (err) {
      console.log('[!!!] pdf-util: ' + err);
    } else {
      console.log('[mmm] pdf-util: wrote ' + namepdf);
    }
  });
}
