;; auto-load this file into emacs with the following in .emacs
;; (load-file "~/path/to/emacs-javascript-bundle/conf.el")


(defvar *bundle-path* (file-name-directory load-file-name))
  
(defvar *json-parse-path* (concat *bundle-path* "json-parse.js"))
(defvar *gfm-util-path* (concat *bundle-path* "gfm-util.js"))
(defvar *pdf-util-path* (concat *bundle-path* "pdf-util.js"))


(defun is-name-valid? (&optional name)
  (when name (equal (stringp name) t)))

(defun JSON ()
  (interactive)
  "validate json"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)    
        (shell-command (concat "node " *json-parse-path* " -i " file-name))
      (warn "buffer-file-name is required"))))
  
(defun GFM ()
  (interactive)
  "create html from github-flavored markdown"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)    
        (shell-command (concat "node " *gfm-util-path* " -i " file-name))
      (warn "buffer-file-name is required"))))

(defun PDF ()
  (interactive)
  "create pdf from github-flavored markdown"
  (let ((file-name buffer-file-name))  
    (if (is-name-valid? file-name)
        (shell-command (concat "node " *pdf-util-path* " -i " file-name))
      (warn "buffer-file-name is required"))))


  



