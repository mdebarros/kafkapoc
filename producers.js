'use strict'

const KafkaHelper = require('./kafkaHelper')
const Mustache = require('mustache')
const uuidv4 = require('uuid/v4')
const Config = require('./config')
const Logger = require('@mojaloop/central-services-shared').Logger
const Perf4js = require('./perf4js')

var runProducer = async (messageNum = 1) => {

  const config1 = Config.producers[0]

  var topicConf = {
    topicName: Config.kafka.topics[0]
  }

  var p1 = await KafkaHelper.createProducer(config1)

  if(messageNum > 1){
    Logger.info(`Sending ${messageNum} messages`)
  } else {
    Logger.info(`Sending a single messages`)
  }

  var metricForStartNow = (new Date()).getTime()
  for(var i = 0; i <  messageNum; i++){

    var messageValues = {
      // id: uuidv4(),
      id: i+1,
      start: (new Date()).getTime()
    }
    Logger.info(`guid=${messageValues.id}:uuid - sendingMessage:process`)
    var message= JSON.parse(Mustache.render(Config.templates.messages[0], messageValues))
    Logger.info(`Sending message ${messageValues.id} - ${JSON.stringify(message)}`)
    var result = await p1.sendMessage(message, topicConf)
    Logger.info(`Message[${messageValues.id}] sent with result: ${result}`)
  }
  var metricForEndNow = (new Date()).getTime()
  var metricTimeProducerForLoop = metricForEndNow - metricForStartNow
  Perf4js.info(messageNum, metricTimeProducerForLoop, 'metricTimeProducerForLoop')

  p1.disconnect()
}
Logger.debug(`process.argv=${process.argv}`)
if(process.argv.length == 3 && !isNaN(process.argv[2])){
  Logger.debug(`2 = ${process.argv[2]}`)
  runProducer(parseInt(process.argv[2]))
} else {
  Logger.debug(`0`)
  runProducer()
}
