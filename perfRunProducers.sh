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
echo "---------------------------------------------------------------------"

node producers.js $MESSAGES_BATCH_SIZE
