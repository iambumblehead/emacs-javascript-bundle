#!/bin/bash
#
# add the load-file expression to $HOME/.emacs:
# (load-file "~/path/to/emacs-javascript-bundle/conf.el")

echo -e "\n(load-file \"${PWD}/conf.el\")" >> $HOME/.emacs
echo "[mmm] setup.sh: modified ${HOME}/.emacs"


