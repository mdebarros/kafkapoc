'use strict'

const Consumer = require('@mojaloop/central-services-shared').Kafka.Consumer
// const ConsumerEnums = require('@mojaloop/central-services-shared').Kafka.Consumer.ENUMS
const Logger = require('@mojaloop/central-services-shared').Logger

const createConsumer = async (topicList, consumeFunction, config) => {
  Logger.debug('createConsumer::start')
  Logger.log('createConsumer::- Instantiate consumer')
  var c = new Consumer(topicList, config)

  Logger.debug('createConsumer::- Connect consumer')
  var connectionResult = await c.connect()

  Logger.debug(`createConsumer::- Connected result=${connectionResult}`)

  Logger.debug('createConsumer::- Consume messages')

  c.consume(consumeFunction)

  // // consume 'ready' event
  // c.on('ready', arg => console.log(`onReady: ${JSON.stringify(arg)}`))
  // // consume 'message' event
  // c.on('message', message => console.log(`onMessage: ${message.offset}, ${JSON.stringify(message.value)}`))
  // // consume 'batch' event
  // c.on('batch', message => console.log(`onBatch: ${JSON.stringify(message)}`))

  Logger.debug(`createConsumer::end - returns ${c}`)
  return c
}

exports.createConsumer = createConsumer
