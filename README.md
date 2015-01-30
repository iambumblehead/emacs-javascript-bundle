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
#### <a id="install"></a>INSTALL:

```bash
$ git clone https://github.com/iambumblehead/emacs-javascript-bundle.git
$ cd emacs-javascript-bundle && npm install
```
 
`npm install` modifes `$HOME/.emacs` to load the included `conf.el`:
 
```lisp
(load-file "~/path/to/emacs-javascript-bundle/conf.el")
```
