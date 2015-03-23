emacs-javascript-bundle
=======================
**(c)[Bumblehead][0], 2015** [MIT-license](#license)  

### OVERVIEW:

 1. **Validate a JSON buffer**
 
 > `M-x JSON`
 
 2. **Generate HTML from a Markdown buffer**
 
 > `M-x GFM`

 3. **Generate PDF from a Markdown buffer**
 
 > `M-x GFM` 


[0]: http://www.bumblehead.com                            "bumblehead"

---------------------------------------------------------
#### <a id="details"></a>DETAILS:

When HTML markup is generated from a markdown file, a check is made for the existence
of a css and js file on the same path as the markdown file. If a css or js file is found
a reference to it is included in the output HTML. for example:

Converting the markdown file in this directory: 
 - `/path/to/my/file.md`
 - `/path/to/my/file.css`

Results in an HTML with the following:

*/path/to/my/file.html*
```html
<html>
  <head>
    <meta http-equiv="content-type" content="text/html" charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="stylesheet" type="text/css" href="./file.css">
  </head>
  <body>:body</body>
</html>
```


Converting the markdown file in this directory: 
 - `/path/to/my/file.md`
 - `/path/to/my/file.css`
 - `/path/to/my/file.js`

Results in an HTML with the following. For convenience `lazyload` is defined and a scripted call to `start` on the name of the file is added.

*/path/to/my/file.html*
```html
<html>
  <head>
    <meta http-equiv="content-type" content="text/html" charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link rel="stylesheet" type="text/css" href="./file.css">
    <script type="text/javascript">
      var lazyload = /* lazyload.js */
    </script>
    <script src="./file.js" type="text/javascript"></script>
  </head>
  <body>
    :body
    <script type="text/javascript">
      typeof file === 'object' && file && typeof file.start === 'function' && file.start();
    </script>
  </body>
</html>
```
    



---------------------------------------------------------
#### <a id="install"></a>INSTALL:

```bash
$ git clone https://github.com/iambumblehead/emacs-javascript-bundle.git
$ cd emacs-javascript-bundle && npm install
```
 
`npm install` modifes `$HOME/.emacs` to load the included `conf.el`:

```lisp
(load-file "~/path/to/emacs-javascript-bundle/conf.el")
```
