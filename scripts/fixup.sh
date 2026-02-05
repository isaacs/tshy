#!/usr/bin/env bash

chmod 0755 .tshy-build/esm/index.js
sync-content .tshy-build dist
rm -rf .tshy-build

esbuild \
  --sourcemap \
  --platform=node \
  --tree-shaking=true \
  --outfile=dist/esm/bin-min.mjs \
  --format=esm \
  --bundle dist/esm/index.js
