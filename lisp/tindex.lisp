#!/usr/local/bin/clisp

(load "quicklisp.lisp")
(quicklisp-quickstart:install)
(ql:quickload :drakma)

(drakma:http-request "https://fnit.site")
