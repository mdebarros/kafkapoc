#!/usr/bin/env bash
source perfEnv.sh

java -jar perf4j-0.9.16.jar $LOG_FILE_CONSUMERS_JS -t 900000
