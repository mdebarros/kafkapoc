'use strict'

const Logger = require('@mojaloop/central-services-shared').Logger
const ConsumerEnums = require('@mojaloop/central-services-shared').Kafka.Consumer.ENUMS
const KafkaHelper = require('./kafkaHelper')
const Perf4js = require('./perf4js')

// const {
//   performance,
//   PerformanceObserver
// } = require('perf_hooks');

const config1 = {
    options: {
      mode: ConsumerEnums.CONSUMER_MODES.recursive,
      batchSize: 1,
      recursiveTimeout: 100,
      messageCharset: 'utf8',
      messageAsJSON: true,
      sync: true,
      consumeTimeout: 1000
    },
    rdkafkaConf: {
      'client.id': 'consumer1',
      'group.id': 'group1',
      'metadata.broker.list': 'localhost:9092',
      'enable.auto.commit': true
    },
    topicConf: {},
    logger: Logger
  }

const topic1 = 'test1'
const topicList1 = [ topic1 ]

const consumeFunction1 = (error, messages) => {
  return new Promise((resolve, reject) => {
    if (error) {
      Logger.info(`Error consuming message - ${error}`)
      // resolve(false)
      reject(error)
    }
    let message = {}

    if (Array.isArray(messages)) {
      message = messages[0]
    } else {
      message = messages
    }

    if (message) { // check if there is a valid message comming back
      Logger.info(`Message Received by callback function - ${JSON.stringify(message)}`)
      var metricStartPayload = parseInt(message.value.metrics.start)
      var metricStartKafkaRead = parseInt(message.timestamp)

      var metricEndNow = (new Date()).getTime()

      var metricTimeDiffFromMessageSendToEnd = metricEndNow - metricStartPayload
      var metricTimeDiffFromMessageSendToPickup = metricStartKafkaRead - metricStartPayload
      var metricTimeDiffFromPickupToEnd = metricEndNow - metricStartKafkaRead

      Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
      Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToPickup, 'metricTimeDiffFromMessageSendToPickup')
      Perf4js.info(metricStartPayload, metricTimeDiffFromPickupToEnd, 'metricTimeDiffFromPickupToEnd')

      // lets check if we have received a batch of messages or single. This is dependant on the Consumer Mode
      if (Array.isArray(message) && message.length != null && message.length > 0) {
        message.forEach(msg => {
          // c.commitMessage(msg)
        })
      } else {
        // c.commitMessage(message)
      }
      resolve(true)
    } else {
      resolve(false)
    }
    // resolve(true)
  })
}

// const timerfyConsumeFunction1 = performance.timerify(consumeFunction1);
//
// const obsTimerfyConsumeFunction1 = new PerformanceObserver((list) => {
//   Logger.warn(list.getEntries()[0].duration);
//   // obsTimerfyConsumeFunction1.disconnect();
// });
// obsTimerfyConsumeFunction1.observe({ entryTypes: ['function'] });
//
//
// var c1 = KafkaHelper.createConsumer(topicList1, timerfyConsumeFunction1, config1)

var c1 = KafkaHelper.createConsumer(topicList1, consumeFunction1, config1)
