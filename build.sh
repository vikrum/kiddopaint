#!/bin/bash

set -e

echo [clean] Removing old app.
rm -f js/app.js

echo -n [build] Building Kiddo Paint app.js..

node_modules/uglify-js/bin/uglifyjs -c -m -o js/app.js \
  js/utils.js \
  js/kiddopaint.js \
  js/display.js \
  js/tools.js \
  js/textures.js \
  js/brushes.js \
  js/builders.js \
  js/colors.js \
  js/stamps.js \
  js/sounds.js \
  js/cache.js \
  js/alphabet.js

echo . done.
