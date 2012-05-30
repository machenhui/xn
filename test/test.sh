#!/bin/bash


 java -jar /media/d/chromeWorkSpace/closure-compiler-git/build/compiler.jar --compilation_level ADVANCED_OPTIMIZATIONS \
  --js jsdoc.js\
  --js Wedgit.js \
  --create_source_map aa.js \
  --create_name_map_files true \
  --output_manifest cc.js \
  --externs loader.js \
  --js_output_file ./test1.js

