// Filename: gfm-util.js  
// Timestamp: 2015.03.26-17:10:15 (last modified)  
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
    highlight = require('highlight.js'),
    input = argv.i || null;

marked.setOptions({
  gfm      : true,
  breaks   : true,
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

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

    fn(null, HTMLStr.replace(/:body/, marked(fd)));
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
  var jslinktpl = 
        '<script type="text/javascript" src="./:n"></script>',
      jsinittpl = 
        '<script type="text/javascript">' +
        '  typeof :name === "object" && :name && typeof :name.start === "function" && :name.start();' +
        '</script>',
      jslazyload = '' +
        '<script type="text/javascript">\n' +
        '' + fs.readFileSync(path.join(__dirname, './node_modules/lazyload/lazyload.js'), 'utf-8') +
        '</script>';

  getMatchedFilenameExtnExist(ogfilename, 'js', function (err, jsfilepath) {
    if (jsfilepath) {
      HTMLStr = HTMLStr.replace(/<\/head>/, function () {
        return jslazyload + '</head>';
      }).replace(/<\/head>/, function () {
        return jslinktpl.replace(/:n/gi, path.basename(jsfilepath)) + '</head>';
      }).replace(/<\/body>/, function () {
        return jsinittpl.replace(/:name/gi, path.basename(jsfilepath, '.js')) + '</body>';
      });      
    }

    fn(null, HTMLStr);
  });  
}

function writeMDtoHTML (mdfilepath, fn) {
  var pathhtml = getMatchedFilenameExtn(mdfilepath, 'html'),
      htmltpl = '' +
        '<html>\n' +
        '  <head>\n' +
        '    <meta http-equiv="content-type" content="text/html" charset="utf-8">\n' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">\n' +
        '    <meta name="apple-mobile-web-app-capable" content="yes">\n' +
        '    <meta name="apple-mobile-web-app-status-bar-style" content="black">\n' +
        '  </head>\n' + 
        '  <body>:body</body>\n' +
        '</html>';

  getHTMLwithBody(htmltpl, mdfilepath, function (err, htmlstr) {
    if (err) return fn(err);

    getHTMLwithCSS(htmlstr, mdfilepath, function (err, htmlstr) {
      if (err) return fn(err);

      getHTMLwithJS(htmlstr, mdfilepath, function (err, htmlstr) {
        if (err) return fn(err);

        fs.writeFile(pathhtml, htmlstr, function (err) {
          if (err) return fn(err);
          fn(null, path.basename(pathhtml));
        });
      });
    });
  });
}

if (input) {
  writeMDtoHTML(input, function (err, namehtml) {
    if (err) {
      console.log('[!!!] gfm-util: ' + err);
    } else {
      console.log('[mmm] gfm-util: wrote ' + namehtml);
    }
  });
}

module.exports.writeMDtoHTML = writeMDtoHTML;
