## kafkaPoc

Proof of concept to analyse Performance Bottlenecks & Issues within the Mojaloop Common Message Streaming Library and underlying dependencies.

### Results

- [Published Results](https://mdebarros.github.io/kafkapoc-results)
- [Raw Results](https://github.com/mdebarros/kafkapoc-results)

### Setup

#### 1. @mojaloop/central-services-shared@2.0.0-snapshot-perf

Clone the following branch: [https://github.com/mdebarros/central-services-shared/tree/feature/perfAnalysis](https://github.com/mdebarros/central-services-shared/tree/feature/perfAnalysis)

In the directory run the following commands:
- `$ npm build`
- `$ npm install`
- `$ npm link`

#### 2. Link the local build to your kafkaPoc project

In the directory for the kafkaPoc run the following command:
- `$ npm link @mojaloop/central-services-shared@2.0.0-snapshot-perf`
- `$ npm build`

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

`perfPrintProcessConsumerResults.sh`: Script to print loadTestingParser TPS report for Consumer

`perfPrintProcessProducerResults.sh`: Script to print loadTestingParser TPS report for Producer

`perfPrintProcessResults.sh`: Script to print loadTestingParser TPS report for combined end-to-end Producer & Consumer

#### 4. Tick Processor to understand the Profiler dump

Run the following command on the Profiler dump:

`$ node --prof-process $PROF_FILE > processed-dump.txt`

Where `$PROF_FILE` = `isolate-<#>v8.log`

#### 5. End-to-end Processing Metrics

5.1. Install loadTestingParser.js dependencies
    
Commands:

- `$ cd ./tools`    
- `$ npm install`
- `$ cd ..`

5.2. See TPS Report for Consumer
`perfPrintProcessConsumerResults.sh`

5.3. See TPS Report for Producer
`perfPrintProcessProducerResults.sh`

5.4. See Combined TPS Report for end-to-end Producer & Consumer
`perfPrintProcessResults.sh`

5.5. Example output:
```bash
$ node ./tools/loadTestingParser.js -n 2 -f {OUTPUTFILE}
First request: 2018-07-04T17:08:39.930Z
Last request: 2018-07-04T17:08:43.872Z
Total number of lines in log file: 2000
Number of unique matched entries: 1000
Total difference of all requests in seconds: 3.942
Shortest response time in second: 0.215
Longest response time in second: 3.156
The average transaction in second: 1.621445
Average transactions per second: 253.67833587011668
```

<!--
5.2. Combined Producer and Consumer logs into sorted and filtered output: 

Command:
`$ grep  -h ".*guid=.*" *_js-*.out | sort > {OUTPUTFILE}`

5.3. Run loadTestingParser.js 

Command:
`$ node ./tools/loadTestingParser.js -n 2 -f {OUTPUTFILE}`

Example output:
```bash
$ node ./tools/loadTestingParser.js -n 2 -f {OUTPUTFILE}
First request: 2018-07-04T17:08:39.930Z
Last request: 2018-07-04T17:08:43.872Z
Total number of lines in log file: 2000
Number of unique matched entries: 1000
Total difference of all requests in seconds: 3.942
Shortest response time in second: 0.215
Longest response time in second: 3.156
The average transaction in second: 1.621445
Average transactions per second: 253.67833587011668
```
-->

### References

- NodeJS Standard Profiler: https://nodejs.org/en/docs/guides/simple-profiling/ 
- 0x Profiler: https://www.npmjs.com/package/0x
- Kafka Configuration Doc for `rdkafka`: 
    - https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#configuration
    - https://github.com/edenhill/librdkafka/blob/0.11.1.x/CONFIGURATION.md
