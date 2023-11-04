#!/usr/bin/env bash

chmod 0755 .tshy-build/esm/index.js
sync-content .tshy-build dist
rm -rf .tshy-build
