#!/usr/bin/env bash

source perfEnv.sh

docker exec -t $DOCKER_ID sh -c " while true; do ./opt/kafka_2.11-0.10.1.0/bin/kafka-consumer-groups.sh --bootstrap-server localhost:9092 --group group1 --describe; sleep 5; done"
