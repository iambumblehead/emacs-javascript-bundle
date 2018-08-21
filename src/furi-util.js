const fs = require('fs'),
      path = require('path'),

      Kuroshiro = require('kuroshiro'),
      KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji');

let kuroshiro = new Kuroshiro();

kuroshiro.init(new KuromojiAnalyzer()).then(() => {
  kuroshiro.convert(process.argv.slice(2).join(' '), {
    mode : 'furigana',
    to : 'hiragana',
    delimiter_start : '[',
    delimiter_end : ']'
  }).then(res => console.log(res.replace(/(<\/?(ruby|rt|rp)>)/gi, '')));
});
