#!/bin/bash
set -o errexit
set -o pipefail
shopt -s nullglob

for f in src/*.js src/*.css src/*.htm* ; do
    echo "$f"
    npx js-beautify --editorconfig -r "$f"
done
