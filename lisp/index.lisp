#|
# exec /usr/local/bin/sbcl --noinform --non-interactive --load "$0" "$@"
exec /usr/local/bin/clisp
|#

(load "quicklisp.lisp")
(ql:quickload :drakma)

(print (drakma:http-request "https://fnit.site"))


