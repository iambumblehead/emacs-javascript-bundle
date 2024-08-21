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

import fs from 'node:fs/promises'
import {createWriteStream} from 'node:fs'
import url from 'node:url'
import path from 'node:path'
import gfmutil from './gfm-util.js'
import { spawnSync } from 'child_process'
import { Readable } from 'stream'
import { finished } from 'stream/promises'

const inputarg = process.argv
  .find(arg => /^--i=/.test(arg))
const input = inputarg && inputarg.split('=')[1]
if (typeof input !== 'string') {
  throw new Error('input must be a path (string)');
}

const downloadFile = async (link, filepath) => {
  const response = await fetch(link)
  const body = Readable.fromWeb(response.body)
  const download_write_stream = await createWriteStream(filepath)
  await finished(body.pipe(download_write_stream))
}

const writeMDtoPDF = (mdfilepath, fn) => {
  // write MD to HTML
  gfmutil(mdfilepath, async (err, namehtml) => {
    const pdfdir = path.join(path.dirname(mdfilepath), 'ejbpdf/')

    const inputbasename = path.basename(mdfilepath, '.md')
    const inputdirname = path.dirname(mdfilepath)
    const inputhtml = path.join(inputdirname, inputbasename + '.html')
    const inputcss = path.join(inputdirname, inputbasename + '.css')

    // keep the "pdf" versions of these files in the original "input directory",
    // so that local paths used in these files will continue to resulve
    const inputpdfhtml = path.join(inputdirname, inputbasename + '.pdf.html')
    const inputpdfcss = path.join(inputdirname, inputbasename + '.pdf.css')
    const outputpdf = path.join(inputdirname, inputbasename + '.pdf')
    const inputpdfassetsdirname = path.join(
      inputdirname, inputbasename + '.pdf.assets')

    const outputpdfhtmlstr = (await fs.readFile(inputhtml, 'utf8'))
      .replace('./index.css', './index.pdf.css')
      .replace('<body>', '<body class="print">')

    await fs.writeFile(inputpdfhtml, outputpdfhtmlstr)
    await fs.mkdir(inputpdfassetsdirname, { recursive: true })

    const inputpdfcssstr = await fs.readFile(inputcss, 'utf8')

    const urlsRe = /\burl\((?:'|")?([^)]+)(?:'|")?\)/gmi
    const urlsMap = {}
    const outputpdfcssstr = inputpdfcssstr.replace(urlsRe, (m, p1, p2) => {
      if (/^https?:\/\//.test(p1)) {
        const p1URL = new url.URL(p1)
        const p1PathLocal = './' + path.join(inputbasename + '.pdf.assets', p1URL.pathname)

        urlsMap[p1] = p1PathLocal

        return 'url(' + p1PathLocal + ')'
      }
      return m
    })

    for (const i in urlsMap) {
      const syspath = path.join(inputdirname, urlsMap[i])
      const syspathstat = await fs.stat(syspath).catch(() => null)

      if (syspathstat && syspathstat.isFile()) {
        continue
      } else {
        console.log(`[...] fetch: "${i}"`)
        await fs.mkdir(path.dirname(syspath) + '/', {recursive: true})
        await downloadFile(i, syspath)
        console.log('[mmm] write: ' + syspath
          .replace(process.cwd(), '.')
          .replace(process.env.HOME, '~'))
      }
    }

    await fs.writeFile(inputpdfcss, outputpdfcssstr)
    const doQTWebEngineHTML2PDFpyURL = new url.URL(
      './doQTWebEngineHTML2PDF.py ', import.meta.url)

    // CAUTION: qtwebengine only generates output file locally from
    // where command was executed and only respects filename (local)
    // and not a filepath
    spawnSync('python', [
      url.fileURLToPath(doQTWebEngineHTML2PDFpyURL),
      url.pathToFileURL(inputpdfhtml).href,
      path.basename(url.pathToFileURL(outputpdf).pathname)
    ], {
      cwd: path.dirname(url.pathToFileURL(outputpdf).pathname)
    })
  })
}

writeMDtoPDF(input, (err, namepdf) => {
  if (err) {
    console.log('[!!!] pdf-util: ' + err)
  } else {
    console.log('[mmm] pdf-util: wrote ' + namepdf)
  }
})
