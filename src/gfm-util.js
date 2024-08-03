// Filename: gfm-util.js  
// Timestamp: 2015.06.07-17:02:23 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses gfm (github-flavored-markup): https://github.com/chjj/marked
// 
// `node gfm-util.js -i /path/to/markdownFile.md`

import fs from 'node:fs'
import path from 'node:path'
import {Marked} from 'marked'
import {markedHighlight} from 'marked-highlight'
import hljs from 'highlight.js'

const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]
if (typeof input !== 'string') {
  throw new Error('input must be a path (string)');
}

const pgmdmarked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight (code, lang) {
      return hljs.highlight(code, {
        language: hljs.getLanguage(lang) ? lang : 'plaintext'
      }).value
    }
  })
)

const htmltpl = `
<html>
  <head>
    <meta http-equiv="content-type" content="text/html" charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
  </head>
  <body>:body</body>
</html>
`.slice(1, -1)

function isfile (filepath, fn) {
  fs.stat(filepath, function(err, stat) {
    return err ? fn(err) : fn(null , stat && stat.isFile());
  });
}

function getMatchedFilenameExtn (ogfilename, newextn) {
  var dir = path.dirname(ogfilename),
      extn = path.extname(ogfilename),
      name = path.basename(ogfilename, extn),
      namehtml = name + '.' + newextn;

  return path.join(dir, namehtml);
}

function getMatchedFilenameExtnExist (ogfilename, newextn, fn) {
  var matchfilename = getMatchedFilenameExtn(ogfilename, newextn);

  isfile(matchfilename, function(err, file) {
    err ? fn(err) : fn(null, matchfilename);
  });
}

function getHTMLwithBody (HTMLStr, ogfilename, fn) {
  fs.readFile(ogfilename, 'utf8', function (err, fd) {
    if (err) return fn(err);

    fn(null, HTMLStr.replace(/:body/, pgmdmarked.parse(fd)));
  });
}

function getHTMLwithCSS (HTMLStr, ogfilename, fn) {
  var csslinktpl = 
        '<link rel="stylesheet" type="text/css" href="./:n">';

  getMatchedFilenameExtnExist(ogfilename, 'css', function (err, cssfilepath) {
    if (cssfilepath) {
      HTMLStr = HTMLStr.replace(/<\/head>/, function () {
        return csslinktpl.replace(/:n/gi, path.basename(cssfilepath)) + '</head>';
      });
    }

    fn(null, HTMLStr);
  });
}

function getHTMLwithJS (HTMLStr, ogfilename, fn) {
  const jslinktpl = 
    '<script type="text/javascript" src="./:n"></script>'
  const jsinittpl =
    '<script type="text/javascript">' +
      '  typeof :name === "object" && :name && typeof :name.start === "function" && :name.start();' +
      '</script>'
  const jslazyload = '' +
    ''
  // '<script type="text/javascript">\n' +
  // '' + fs.readFileSync(path.join(__dirname, './../node_modules/lazyload/lazyload.js'), 'utf-8') +
  // '</script>';

  getMatchedFilenameExtnExist(ogfilename, 'js', function (err, jsfilepath) {
    if (jsfilepath) {
      HTMLStr = HTMLStr
        .replace(/<\/head>/, () => jslazyload + '</head>')
        .replace(/<\/head>/, () => jslinktpl
          .replace(/:n/gi, path.basename(jsfilepath)) + '</head>')
        .replace(/<\/body>/, () => jsinittpl
          .replace(/:name/gi, path.basename(jsfilepath, '.js')) + '</body>')
      });      
    }

    fn(null, HTMLStr);
  });  
}

const writeMDtoHTML = (mdfilepath, fn) => {
  const pathhtml = getMatchedFilenameExtn(mdfilepath, 'html'),

  getHTMLwithBody(htmltpl, mdfilepath, (err, htmlstr) => {
    if (err) return fn(err);

    getHTMLwithCSS(htmlstr, mdfilepath, (err, htmlstr) => {
      if (err) return fn(err);

      getHTMLwithJS(htmlstr, mdfilepath, (err, htmlstr) => {
        if (err) return fn(err);

        fs.writeFile(pathhtml, htmlstr, err => {
          if (err) return fn(err);
          fn(null, path.basename(pathhtml));
        });
      });
    });
  });
}
  
writeMDtoHTML(input, (err, namehtml) => {
  if (err) {
    console.log('[!!!] gfm-util: ' + err)
  } else {
    console.log('[mmm] gfm-util: wrote ' + namehtml)
  }
})

export default writeMDtoHTML
