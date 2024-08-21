emacs-javascript-bundle
=======================

**(c)[Bumblehead][0]** [MIT-license](#license)

Make commands available to emacs,

 1. `M-x JSON` to validate a JSON buffer
 2. `M-x GFM` to generate HTML from a Markdown buffer
 3. `M-x PDF` to generate PDF from a Markdown buffer
 4. `M-x VDOM` to generate VDOM from an HTML buffer
 5. `M-x FURI` to generate furigana from a selection of kanji


When HTML markup is generated from a markdown file, a check is made for the existence of a css or js file on the same path as the markdown file. If a css or js file is found a reference to it is included in the output HTML. for example:

Converting the markdown file in this directory: 
 - `/path/to/my/file.md`
 - `/path/to/my/file.css`

Results in an HTML with the following:

*/path/to/my/file.html*
```html
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="./file.css">
  </head>
  <body>:body</body>
</html>
```


Converting the markdown file in this directory: 
 - `/path/to/my/file.md`
 - `/path/to/my/file.css`
 - `/path/to/my/file.js`

Results in an HTML with the following. For convenience a scripted call to `start` on the name of the file is added.

*/path/to/my/file.html*
```html
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="./file.css">
    <script src="./file.js" type="text/javascript"></script>
  </head>
  <body>
    :body
    <script type="text/javascript">
      typeof file === 'object'
          && file && typeof file.start === 'function'
          && file.start()
    </script>
  </body>
</html>
```

---------------------------------------------------------
#### <a id="install"></a>install


```bash
$ git clone https://github.com/iambumblehead/emacs-javascript-bundle.git
$ cd emacs-javascript-bundle && npm install
```
 
`npm install` modifes `$HOME/.config/init/emacs.el` to load the included `conf.el`:

```lisp
(load-file "~/path/to/emacs-javascript-bundle/conf.el")
```

For rendering PDF files, you'll need `python` and `qtwebengine`.


[0]: http://www.bumblehead.com                            "bumblehead"
