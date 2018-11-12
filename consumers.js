'use strict'

const Logger = require('@mojaloop/central-services-shared').Logger
// const ConsumerEnums = require('@mojaloop/central-services-shared').Kafka.Consumer.ENUMS
const KafkaHelper = require('./kafkaHelper')
const Perf4js = require('./perf4js')
const Config = require('./config')

const config1 = Config.consumers[0]

const topics1 = Config.kafka.topics

let c1
// const sleep = (ms) => {
//   var unixtime_ms = new Date().getTime()
//   while(new Date().getTime() < unixtime_ms + ms) {}
// }

const consumeFunction1 = async (error, messages) => {
  return new Promise((resolve, reject) => {
    var metricStartNow = (new Date()).getTime()
    var id = 0
    if (error) {
      Logger.info(`Error consuming message - ${error}`)
      reject(error)
    }
    // sleep(2000)
    if (messages) { // check if there is a valid message comming back
      Logger.debug(`Messages Received by callback function - ${JSON.stringify(messages)}`)

      // lets check if we have received a batch of messages or single. This is dependant on the Consumer Mode
      if (Array.isArray(messages) && messages.length != null && messages.length > 0) {
        Logger.info(`Processing a message batch of size ${messages.length}`)
        for( let message of messages) {
          id = message.value.content.id
          // c1.commitMessage(message)
          // c1.commitMessageSync(message)
          var metricStartPayload = parseInt(message.value.content.metrics.start)
          var metricStartKafkaRead = parseInt(message.timestamp)

          var metricEndNow = (new Date()).getTime()
          Logger.info(`guid=${id}:uuid - receivedMessage:process - start`)

          // Comment out both lines if you do not wish to manual commit. Also ensure that you enable `"enable.auto.commit": true` in the config if you disable both lines
          // c1.commitMessage(message)
          c1.commitMessageSync(message)

          var metricTimeDiffFromMessageSendToEnd = metricEndNow - metricStartPayload
          var metricTimeDiffFromMessageSendToDropoff = metricStartKafkaRead - metricStartPayload
          var metricTimeDiffFromDropoffToEnd = metricEndNow - metricStartKafkaRead

          Perf4js.info(id, metricTimeDiffFromMessageSendToDropoff, 'metricTimeDiffFromMessageSendToDropoff')
          Perf4js.info(id, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
          Perf4js.info(id, metricTimeDiffFromDropoffToEnd, 'metricTimeDiffFromDropoffToEnd')
          // Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToDropoff, 'metricTimeDiffFromMessageSendToDropoff')
          // Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
          // Perf4js.info(metricStartPayload, metricTimeDiffFromDropoffToEnd, 'metricTimeDiffFromDropoffToEnd')
          Logger.info(`guid=${id}:uuid - receivedMessage:process - end`)
        }
        // messages.forEach(message => {
        //   // c.commitMessage(msg)
        //   c1.commitMessageSync(message)
        //   var metricStartPayload = parseInt(message.value.content.metrics.start)
        //   var metricStartKafkaRead = parseInt(message.timestamp)
        //
        //   var metricEndNow = (new Date()).getTime()
        //
        //   var metricTimeDiffFromMessageSendToEnd = metricEndNow - metricStartPayload
        //   var metricTimeDiffFromMessageSendToDropoff = metricStartKafkaRead - metricStartPayload
        //   var metricTimeDiffFromDropoffToEnd = metricEndNow - metricStartKafkaRead
        //
        //   Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToDropoff, 'metricTimeDiffFromMessageSendToDropoff')
        //   Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
        //   Perf4js.info(metricStartPayload, metricTimeDiffFromDropoffToEnd, 'metricTimeDiffFromDropoffToEnd')
        // })
      } else {
        var message = messages
        id = message.value.content.id

        Logger.info(`Processing a single message`)
        var metricStartPayload = parseInt(message.value.content.metrics.start)
        var metricStartKafkaRead = parseInt(message.timestamp)

        var metricEndNow = (new Date()).getTime()
        Logger.info(`guid=${id}:uuid - receivedMessage:process - start`)

        // Comment out both lines if you do not wish to manual commit. Also ensure that you enable `"enable.auto.commit": true` in the config if you disable both lines
        // c1.commitMessage(message)
        c1.commitMessageSync(message)

        var metricTimeDiffFromMessageSendToEnd = metricEndNow - metricStartPayload
        var metricTimeDiffFromMessageSendToDropoff = metricStartKafkaRead - metricStartPayload
        var metricTimeDiffFromDropoffToEnd = metricEndNow - metricStartKafkaRead
        id = message.value.content.id
        Perf4js.info(id, metricTimeDiffFromMessageSendToDropoff, 'metricTimeDiffFromMessageSendToDropoff')
        Perf4js.info(id, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
        Perf4js.info(id, metricTimeDiffFromDropoffToEnd, 'metricTimeDiffFromDropoffToEnd')
        // Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToDropoff, 'metricTimeDiffFromMessageSendToDropoff')
        // Perf4js.info(metricStartPayload, metricTimeDiffFromMessageSendToEnd, 'metricTimeDiffFromMessageSendToEnd')
        // Perf4js.info(metricStartPayload, metricTimeDiffFromDropoffToEnd, 'metricTimeDiffFromDropoffToEnd')
        Logger.info(`guid=${id}:uuid - receivedMessage:process - end`)
      }
      var metricEndNow = (new Date()).getTime()
      var metricEndOfCallBack = metricEndNow - metricStartNow
      Perf4js.info(id, metricEndOfCallBack, 'metricEndOfCallBack')
      // Perf4js.info(metricStartNow, metricEndOfCallBack, 'metricEndOfCallBack')
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

// var c1 = KafkaHelper.createConsumer(topics1, consumeFunction1, config1)

// wrap consumeFunction1 with per metrics

const {
  performance,
  PerformanceObserver
} = require('perf_hooks');

const timerfyConsumeFunction1 = performance.timerify(consumeFunction1)

const obsTimerfyConsumeFunction1 = new PerformanceObserver((list) => {
  const μs = require('microseconds')
  // Logger.warn(list.getEntries()[0].duration);
  // obsTimerfyConsumeFunction1.disconnect();
  var metricNow = (new Date()).getTime()
  var perfObsDuration = list.getEntries()[0].duration
  var metricOfPerfObsCallBackConsumerFunction = μs.parse(perfObsDuration).microseconds
  Perf4js.info(metricNow, metricOfPerfObsCallBackConsumerFunction, 'metricOfPerfObsCallBackConsumerFunction')
});
obsTimerfyConsumeFunction1.observe({ entryTypes: ['function'] });

// var c1 = KafkaHelper.createConsumer(topics1, timerfyConsumeFunction1, config1)

// c1 = KafkaHelper.createConsumer(topics1, timerfyConsumeFunction1, config1)

const startKafkaConsume = async () => {
  c1 = await KafkaHelper.createConsumer(topics1, timerfyConsumeFunction1, config1)
}

startKafkaConsume().then( ()=>{ Logger.info('Consumer created...') })
