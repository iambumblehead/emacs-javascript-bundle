// Filename: gfm-util.js  
// Timestamp: 2015.06.07-17:02:23 (last modified)  
// Author(s): Bumblehead (www.bumblehead.com)
//
// generate an html file from given markdown input, for use with emacs.
// uses gfm (github-flavored-markup): https://github.com/chjj/marked
//
// `node gfm-util.js -i /path/to/markdownFile.md`

import fs from 'node:fs/promises'
import path from 'node:path'
import {Marked} from 'marked'
import {markedHighlight} from 'marked-highlight'
import markedFootnote from 'marked-footnote'
import hljs from 'highlight.js'

const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]

const jslinktpl = '<script type="module" src="./:n"></script>'
const csslinktpl = '<link rel="stylesheet" type="text/css" href="./:n">'
const htmltpl = (
`<!DOCTYPE html>
<html xml:lang="en-US" lang="en-US">  
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>:body</body>
</html>`)

const jsinittpl = (
`<script type="text/javascript">
  typeof :name === "object"
    && :name && typeof :name.start === "function"
    && :name.start()
</script>`)

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

const isfile = filepath => fs
  .stat(filepath)
  .then(stat => stat.isFile())
  .catch(() => false)

const getMatchedFilenameExtn = (ogfilename, newextn) => {
  const dir = path.dirname(ogfilename)
  const extn = path.extname(ogfilename)
  const name = path.basename(ogfilename, extn)
  const namehtml = name + '.' + newextn

  return path.join(dir, namehtml);
}

const getMatchedFilenameExtnExist = async (ogfilename, newextn) => {
  const matchfilename = getMatchedFilenameExtn(ogfilename, newextn);

  return (await isfile(matchfilename)) && matchfilename
}

const getHTMLwithBody = async (HTMLStr, ogfilename) => {
  const fd = await fs.readFile(ogfilename, 'utf8')

  return fd && HTMLStr.replace(/:body/, pgmdmarked.parse(fd))
}

const getHTMLwithCSS = async (HTMLStr, ogfilename) => {
  const cssfilepath = await getMatchedFilenameExtnExist(ogfilename, 'css')
  return cssfilepath ? HTMLStr
    .replace(/<\/head>/, () => csslinktpl.replace(/:n/gi, path.basename(cssfilepath)) + '</head>')
    : HTMLStr
}

const getHTMLwithJS = async (HTMLStr, ogfilename) => {
  const jslazyload = ''
  // '<script type="text/javascript">\n' +
  // '' + fs.readFileSync(path.join(__dirname, './../node_modules/lazyload/lazyload.js'), 'utf-8') +
  // '</script>';

  const jsfilepath = await getMatchedFilenameExtnExist(ogfilename, 'js')
  return jsfilepath ? HTMLStr
      .replace(/<\/head>/, () => jslazyload + '</head>')
      .replace(/<\/head>/, () => jslinktpl
        .replace(/:n/gi, path.basename(jsfilepath)) + '</head>')
      .replace(/<\/body>/, () => jsinittpl
        .replace(/:name/gi, path.basename(jsfilepath, '.js')) + '</body>')
    : HTMLStr
}

const writeMDtoHTML = async (mdfilepath, htmlstr) => {
  const pathhtml = getMatchedFilenameExtn(mdfilepath, 'html')

  console.log({ pathhtml })
  htmlstr = await getHTMLwithBody(htmltpl, mdfilepath)
  console.log({ htmlstr })
  htmlstr = await getHTMLwithCSS(htmlstr, mdfilepath)
  console.log({ htmlstr })
  htmlstr = await getHTMLwithJS(htmlstr, mdfilepath)
  console.log({ htmlstr })

  
  await fs.writeFile(pathhtml, htmlstr)

  return path.basename(pathhtml)
}

if (process.argv.find(arg => /gfm-util\.js/.test(arg))) {
  if (typeof input !== 'string') {
    throw new Error('input must be a path (string)');
  }
  const namehtml = await writeMDtoHTML(input)
  console.log('[mmm] gfm-util: wrote ' + namehtml)
}

export default writeMDtoHTML
