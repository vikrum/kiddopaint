#!/bin/bash

set -e

echo [clean] Removing old app.
rm -f js/app.js

echo -n [build] Building Kiddo Paint app.js..

node_modules/uglify-js/bin/uglifyjs -c -m -o js/app.js \
  js/init/* \
  js/util/* \
  js/tools/* \
  js/textures/* \
  js/brushes/* \
  js/builders/* \
  js/stamps/* \
  js/sounds/* \

echo . done.
