'use strict'

const KafkaHelper = require('./kafkaHelper')
const Mustache = require('mustache')
const uuidv4 = require('uuid/v4')
const Config = require('./config')
const Logger = require('@mojaloop/central-services-shared').Logger

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

  for(var i = 0; i <  messageNum; i++){
    var messageValues = {
      id: uuidv4(),
      start: (new Date()).getTime()
    }

    var message= JSON.parse(Mustache.render(Config.templates.messages[0], messageValues))
    Logger.info(`Sending message ${i+1} - ${JSON.stringify(message)}`)
    var result = await p1.sendMessage(message, topicConf)
    Logger.info(`Message[${i+1}] sent with result: ${result}`)
  }

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
