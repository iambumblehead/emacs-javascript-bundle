emacs-javascript-bundle
=======================

**(c)[Bumblehead][0]** [MIT-license](#license)

Make commands available to emacs,

 1. `M-x JSON` to validate a JSON buffer
 2. `M-x GFM` to generate HTML from a Markdown buffer
 3. `M-x PDF` to generate PDF from a Markdown buffer
 4. `M-x VDOM` to generate VDOM from an HTML buffer
 5. `M-x FURI` to generate furigana from a selection of kanji


When HTML is generated from a markdown file, a check is made for the existence of css and js files on the same path as the markdown file. If a css or js file is found a reference to it is included in the output HTML.

Converting the markdown file in this directory,
```bash
.
├── file.css
├── file.js
└── file.md
```

Results in an HTML with the following:

*/path/to/my/file.html*
```html
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- only added if ./file.css exists -->
    <link rel="stylesheet" type="text/css" href="./file.css">
    <!-- only added if ./file.js exists -->
    <script src="./file.js" type="module"></script>
  </head>
  <body>:body</body>
  <!-- only added if ./file.js exists -->
  <script type="text/javascript">
    typeof file === 'object'
      && file && typeof file.start === 'function'
      && file.start()
  </script>
</html>
```


---------------------------------------------------------
#### <a id="install"></a>install


```bash
$ git clone https://github.com/iambumblehead/emacs-javascript-bundle.git
$ cd emacs-javascript-bundle && npm install
```
 
`npm install` modifes `$HOME/.config/init/emacs.el` adding,
```lisp
(load-file "~/path/to/emacs-javascript-bundle/conf.el")
```

For rendering PDF files, `python` and `qtwebengine` are needed.


[0]: http://www.bumblehead.com                            "bumblehead"
