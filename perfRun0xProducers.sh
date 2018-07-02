#!/usr/bin/env bash
echo "---------------------------------------------------------------------"
echo "Starting Producers Run Script..."
echo "---------------------------------------------------------------------"
echo

echo "Loading env vars..."
source perfEnv.sh

echo
echo "---------------------------------------------------------------------"
echo "Starting Producers with ${MESSAGES_BATCH_SIZE} messages"
echo "*** Press CTRL+C once Consumer is finished! ***"
echo "---------------------------------------------------------------------"

NODE_ENV=production

0x --output-dir perf0xProducer producers.js $MESSAGES_BATCH_SIZE > $LOG_FILE_PRODUCER_JS &

tail -1000f $LOG_FILE_PRODUCER_JS
