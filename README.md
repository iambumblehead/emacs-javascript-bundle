emacs-javascript-bundle
=======================
**(c)[Bumblehead][0], 2013** [MIT-license](#license)  

### OVERVIEW:


A bundle to ease web-development using emacs and node.js to:

  1. Check if the buffer-file is valid JSON formatted string
  2. Generate an html file from a markdown buffer-file


[0]: http://www.bumblehead.com                            "bumblehead"

---------------------------------------------------------
#### <a id="install"></a>INSTALL:

 ```bash
 $ git clone https://github.com/iambumblehead/emacs-javascript-bundle.git`  
 $ cd emacs-javascript-bundle && npm install`
 ```
 
 `npm install` modifes `$HOME/.emacs` to load the included `conf.el`:
 
 ```lisp
 (load-file "~/path/to/emacs-javascript-bundle/conf.el")
 ```
 
---------------------------------------------------------

#### <a id="get-started">GET STARTED:

 1. **Validate a JSON file**   
 
 load a .json file in an emacs buffer.

 > `M-x JSON`
 
 1. **Generate HTML from Markdown**   
 
 load a .md file in an emacs buffer. _GFM - 'github-flavored-markdown'_
 
 > `M-x GFM` 
    
