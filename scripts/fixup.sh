#!/usr/bin/env bash

chmod 0755 .tshy-build-tmp/esm/index.js
sync-content .tshy-build-tmp dist
rm -rf .tshy-build-tmp
