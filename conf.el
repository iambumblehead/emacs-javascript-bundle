;; auto-load this file into emacs with the following in .emacs
;; (load-file "~/Software/Emacs/jsPower.el")

(defvar *bundle-path* "~/Software/Emacs/emacs-javascript-bundle/")
(defvar *json-parse-path* (concat *bundle-path* "json-parse.js"))
(defvar *gfm-util-path* (concat *bundle-path* "gfm-util.js"))

(defun JSON () (interactive)
  "validate json"
  (let ((file-name buffer-file-name))
    (shell-command (concat "node " *json-parse-path* " -i " file-name))))

(defun GFM () (interactive)
  "create html from github-flavored markdown"
  (let ((file-name buffer-file-name))
    (shell-command (concat "node " *gfm-util-path* " -i " file-name))))

  


