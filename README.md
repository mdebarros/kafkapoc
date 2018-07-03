## kafkaPoc

Proof of concept to analyse Performance Bottlenecks & Issues within the Mojaloop Common Message Streaming Library and underlying dependencies.

### Results

- [Published Results](https://mdebarros.github.io/kafkapoc-results)
- [Raw Results](https://github.com/mdebarros/kafkapoc-results)

### Setup

#### 1. @mojaloop/central-services-shared@2.0.0-snapshot-perf

Clone the following branch: [https://github.com/mdebarros/central-services-shared/tree/feature/perfAnalysis](https://github.com/mdebarros/central-services-shared/tree/feature/perfAnalysis)

In the directory run the following commands:
- `npm build`
- `npm install`
- `npm link`

#### 2. Link the local build to your kafkaPoc project

In the directory for the kafkaPoc run the following command:
- `npm link @mojaloop/central-services-shared@2.0.0-snapshot-perf`
- `npm build`

### Starting kafkaPoc

#### 1. Config NodeJs

Edit the `config.json` for Node Producer & Consumer options.

#### 2. Env Vars for Scripts

Edit the `perfEnv.sh` file.

#### 3. Scripts

`perfEnv.sh`: Env variables for scripts

`perfRestartKafka.sh`: Script to restart Kafka by Spotify.

`perfRestartKafka-johnnypark.sh`: Script to restart Kafka using the JohnnyPark's image. This should be the later version of Kafka.

`perfRunProducers.sh`: Script to start Producers

`perfRunConsumers.sh`: Script to start Consumers _(note that you will have to CTRL+C to stop the Consumer)_

`perfRun0xProducers.sh`: Script to start Producers with the 0x Profiler

`perfRun0xConsumers.sh`: Script to start Consumers _(note that you will have to CTRL+C to stop the Consumer)_  with the 0x Profiler

`perfMonitorKafkaGroup1.sh`: Script to monitor Kafka Group `group1` (used by Consumers) - (currently does not work with JohnnyPark's image)

`perfPrintConsumerResults.sh`: Script to print Per4j output for the Consumer

`perfPrintProducerResults.sh`: Script to print Per4j output for the Producer

#### 4. Tick Processor to understand the Profiler dump

Run the following command on the Profiler dump:

`$ node --prof-process $PROF_FILE > processed-dump.txt`

Where `$PROF_FILE` = `isolate-<#>v8.log`

### References

- NodeJS Standard Profiler: https://nodejs.org/en/docs/guides/simple-profiling/ 
- 0x Profiler: https://www.npmjs.com/package/0x
- Kafka Configuration Doc for `rdkafka`: 
    - https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#configuration
    - https://github.com/edenhill/librdkafka/blob/0.11.1.x/CONFIGURATION.md
