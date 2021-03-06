echo "---------------------------------------------------------------------"
echo "Starting Consumers Run Script..."
echo "---------------------------------------------------------------------"
echo

echo "Loading env vars..."
source perfEnv.sh

echo "Log file to be created: ${LOG_FILE_CONSUMERS_JS}"

echo
echo "---------------------------------------------------------------------"
echo "Starting Consumers"
echo "*** Press CTRL+C once Consumer is finished! ***"
echo "---------------------------------------------------------------------"

NODE_ENV=production

node --prof --log-timer-events consumers.js > $LOG_FILE_CONSUMERS_JS &

tail -1000f $LOG_FILE_CONSUMERS_JS
