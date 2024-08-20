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
import markedFootnote from 'marked-footnote'
import hljs from 'highlight.js'

const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]

const pgmdmarked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight (code, lang) {
      return hljs.highlight(code, {
        language: hljs.getLanguage(lang) ? lang : 'plaintext'
      }).value
    }
  })
).use(markedFootnote())

console.log('hasfootnote')

const htmltpl = `
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body>:body</body>
</html>
`.slice(1, -1)

const jslinktpl = `
  <script type="text/javascript" src="./:n"></script>
`.slice(1, -1)

const jsinittpl = `
<script type="text/javascript">' +
  typeof :name === "object" && :name && typeof :name.start === "function" && :name.start();' +
</script>
`.slice(1, -1)

const isfile = (filepath, fn) => {
  fs.stat(filepath, (err, stat) => {
    return err ? fn(err) : fn(null , stat && stat.isFile());
  })
}

const getMatchedFilenameExtn = (ogfilename, newextn) => {
  const dir = path.dirname(ogfilename)
  const extn = path.extname(ogfilename)
  const name = path.basename(ogfilename, extn)
  const namehtml = name + '.' + newextn

  return path.join(dir, namehtml);
}

const getMatchedFilenameExtnExist = (ogfilename, newextn, fn) => {
  const matchfilename = getMatchedFilenameExtn(ogfilename, newextn);

  isfile(matchfilename, (err, file) => {
    err ? fn(err) : fn(null, matchfilename)
  })
}

const getHTMLwithBody = (HTMLStr, ogfilename, fn) => {
  fs.readFile(ogfilename, 'utf8', (err, fd) => {
    if (err) return fn(err);

    fn(null, HTMLStr.replace(/:body/, pgmdmarked.parse(fd)))
  })
}

const getHTMLwithCSS = (HTMLStr, ogfilename, fn) => {
  const csslinktpl = 
    '<link rel="stylesheet" type="text/css" href="./:n">';

  getMatchedFilenameExtnExist(ogfilename, 'css', (err, cssfilepath) => {
    if (cssfilepath) {
      HTMLStr = HTMLStr.replace(/<\/head>/, () => (
        csslinktpl.replace(/:n/gi, path.basename(cssfilepath)) + '</head>'))
    }

    fn(null, HTMLStr);
  });
}

const getHTMLwithJS = (HTMLStr, ogfilename, fn) => {
  const jslazyload = '' +
    ''
  // '<script type="text/javascript">\n' +
  // '' + fs.readFileSync(path.join(__dirname, './../node_modules/lazyload/lazyload.js'), 'utf-8') +
  // '</script>';

  getMatchedFilenameExtnExist(ogfilename, 'js', (err, jsfilepath) => {
    if (jsfilepath) {
      HTMLStr = HTMLStr
        .replace(/<\/head>/, () => jslazyload + '</head>')
        .replace(/<\/head>/, () => jslinktpl
          .replace(/:n/gi, path.basename(jsfilepath)) + '</head>')
        .replace(/<\/body>/, () => jsinittpl
          .replace(/:name/gi, path.basename(jsfilepath, '.js')) + '</body>')
    }

    fn(null, HTMLStr);
  });  
}

const writeMDtoHTML = (mdfilepath, fn) => {
  const pathhtml = getMatchedFilenameExtn(mdfilepath, 'html')

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

if (process.argv.find(arg => /gfm-util\.js/.test(arg))) {
  if (typeof input !== 'string') {
    throw new Error('input must be a path (string)');
  }
  writeMDtoHTML(input, (err, namehtml) => {
    if (err) {
      console.log('[!!!] gfm-util: ' + err)
    } else {
      console.log('[mmm] gfm-util: wrote ' + namehtml)
    }
  })
}

export default writeMDtoHTML
