// Filename: gfm-util.js  
// Timestamp: 2015.02.17-11:09:54 (last modified)  
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
    input = argv.i || null;

marked.setOptions({
  gfm      : true,
  breaks   : true,
  highlight: function(code, lang) {
    return lang === 'js' ? marked.highlighter.javascript(code) : code;
  }
});

function isfile (filepath, fn) {
  fs.stat(filepath, function(err, stat) {
    return err ? fn(err) : fn(null , stat && stat.isFile());
  });
}

function writeMDtoHTML (mdfilepath, fn) {
  var csslinktpl = 
        '<link rel="stylesheet" type="text/css" href="./:n">',
      htmltpl = '' +
        '<html>' +
        '  <head>' +
        '    <meta http-equiv="content-type" content="text/html" charset="utf-8">' +
        '    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">' +
        '    <meta name="apple-mobile-web-app-capable" content="yes">' +
        '    <meta name="apple-mobile-web-app-status-bar-style" content="black">' +
        '  </head>' + 
        '  <body>:body</body>' +
        '</html>';

  fs.readFile(mdfilepath, 'utf8', function (err, fd) {
    if (err) return fn(err);

    var dir = path.dirname(mdfilepath),
        extn = path.extname(mdfilepath),
        name = path.basename(mdfilepath, extn),
        namecss = name + '.css',
        pathcss = path.join(dir, namecss),
        namehtml = name + '.html',
        pathhtml = path.join(dir, namehtml);

    isfile(pathcss, function(err, iscss) {
      var text = htmltpl
        .replace(/:body/, marked(fd))
        .replace(/<\/head>/, function () {
          return (iscss ? csslinktpl.replace(/:n/gi, namecss) : '') + '</head>';
        });

      fs.writeFile(pathhtml, text, function (err) {
        if (err) return fn(err);
        fn(null, namehtml);
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
