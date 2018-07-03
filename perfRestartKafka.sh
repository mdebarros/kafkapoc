#!/usr/bin/env bash
echo "---------------------------------------------------------------------"
echo "Starting Kafka Restart Script..."
echo "---------------------------------------------------------------------"
echo

echo "Loading env vars..."
source perfEnv.sh

echo
echo "---------------------------------------------------------------------"
echo " Creating Docker Kafka Instance"
echo "---------------------------------------------------------------------"
echo "Destroying Docker ${DOCKER_ID}"

docker stop $DOCKER_ID
docker rm $DOCKER_ID

docker run -td -p 2181:2181 -p 9092:9092 --name=${DOCKER_ID} --env ADVERTISED_HOST=localhost --env ADVERTISED_PORT=9092 --env CONSUMER_THREADS=1 --env TOPICS=my-topic,some-other-topic --env ZK_CONNECT=kafka7zookeeper:2181/root/path --env GROUP_ID=mymirror spotify/kafkaproxy
echo "Starting Docker ${DOCKER_ID}"

echo
echo "Sleeping for ${SLEEP_FACTOR_IN_SECONDS}s for Kafka startup..."
sleep $SLEEP_FACTOR_IN_SECONDS
echo
