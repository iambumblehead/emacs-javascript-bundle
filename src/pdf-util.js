// Filename: pdf-util.js  
// Timestamp: 2015.03.26-17:43:13 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses pdf (github-flavored-markup): https://github.com/chjj/marked
// 
// `node pdf-util.js -i /path/to/markdownFile.md`
//
// to use this, you'll need the wkhtmltopdf binary,
// http://wkhtmltopdf.org/

import fs from 'node:fs'
import path from 'node:path'
import gfmutil from './gfm-util.js'
import { exec } = from 'child_process'

const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]
if (typeof input !== 'string') {
  throw new Error('input must be a path (string)');
}

const writeMDtoPDF = (mdfilepath, fn) => {
  gfmutil.writeMDtoHTML(mdfilepath, (err, namehtml) => {
    if (err) return fn(err);

      const namepdf = namehtml.replace(/html/, 'pdf')
      const wkhtmltopdfbin = 'wkhtmltopdf'; // make sure this binary in $PATH

      return exec(wkhtmltopdfbin + ' ' 
      + '--print-media-type ' 
      + '--page-size letter '
      + '--run-script \'document.body.className="pdf";\' ' 
      + '--margin-left 0mm --margin-right 0mm --margin-top 0mm ' 
      + namehtml + ' ' + namepdf, (err, stdout, stderr) => {
        fn(err, namepdf);
      });      
  });
}

writeMDtoPDF(input, (err, namepdf) => {
  if (err) {
    console.log('[!!!] pdf-util: ' + err)
  } else {
    console.log('[mmm] pdf-util: wrote ' + namepdf)
  }
})
