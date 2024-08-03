;; auto-load this file into emacs with the following in .emacs
;; (load-file "~/path/to/emacs-javascript-bundle/conf.el")


(defvar *bundle-path* (file-name-directory load-file-name))

(defvar *json-parse-path* (concat *bundle-path* "src/json-parse.js"))
(defvar *furi-util-path* (concat *bundle-path* "src/furi-util.js"))
(defvar *vdom-util-path* (concat *bundle-path* "src/vdom-util.js"))
(defvar *gfm-util-path* (concat *bundle-path* "src/gfm-util.js"))
(defvar *pdf-util-path* (concat *bundle-path* "src/pdf-util.js"))

(defun is-name-valid? (&optional name)
  (when name (equal (stringp name) t)))

(defun JSON ()
  (interactive)
  "validate json"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)
        (shell-command
         (concat "cd " *bundle-path* "; "
                 "npm run JSON -- --i=" file-name))
      (warn "buffer-file-name is required"))))
  
(defun GFM ()
  (interactive)
  "create html from github-flavored markdown"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)
        (shell-command
         (concat "cd " *bundle-path* "; "
                 "npm run GFM -- --i=" file-name))
      (warn "buffer-file-name is required"))))

(defun PDF ()
  (interactive)
  "create pdf from github-flavored markdown"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)
        (shell-command
         (concat "cd " *bundle-path* "; "
                 "npm run PDF -- --i=" file-name))
      (warn "buffer-file-name is required"))))

(defun VDOM ()
  (interactive)
  "create vdom from mustache/handlebars markdown"
  (let ((file-name buffer-file-name))
    (if (is-name-valid? file-name)
        (shell-command (concat "node " *vdom-util-path* " -i " file-name))
      (warn "buffer-file-name is required"))))

;;
;; https://stackoverflow.com/questions/14201740/replace-region-with-result-of-calling-a-function-on-region
;;
(defun apply-function-to-region (fn)
  (interactive "XFunction to apply to region: ")
  (save-excursion
    (let* ((beg (region-beginning))
           (end (region-end))
           (resulting-text 
            (funcall fn (buffer-substring-no-properties beg end))))
      (kill-region beg end)
      (insert resulting-text))))

(defun FURI-serialize (str)
  (replace-regexp-in-string "\n" "fvuvrvi" str))

(defun FURI-deserialize (str)
  (replace-regexp-in-string "fvuvrvi" "\n" str))

(defun FURI-ize (str)
  (FURI-deserialize
   (shell-command-to-string
    (concat "node " *furi-util-path* " " (FURI-serialize str)))))

(defun FURI ()
  (interactive)
  "create furigana from kanji"
  (apply-function-to-region 'FURI-ize))
