#!/usr/bin/env bash
source perfEnv.sh

grep  -h ".*guid=.*" *_js-$suffix.out | sort > $COMBINED_OUTPUT

node ./tools/loadTestingParser.js -n 4 -f $COMBINED_OUTPUT
