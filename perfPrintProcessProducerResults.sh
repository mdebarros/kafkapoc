#!/usr/bin/env bash
source perfEnv.sh

node ./tools/loadTestingParser.js -n 2 -f $LOG_FILE_PRODUCER_JS
