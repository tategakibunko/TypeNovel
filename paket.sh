#! /bin/sh

SCRIPT_DIR=$(dirname $0)

exec mono $SCRIPT_DIR/.paket/paket.exe "$@"
