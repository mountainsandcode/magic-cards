const fs = require('fs')

const SonosAction = require('./actions/SonosAction')
const HomeAssistantAction = require('./actions/HomeAssistantAction')
const ChannelsAction = require('./actions/ChannelsAction')
const ScriptAction = require('./actions/ScriptAction')

class CardProcessor {
  process(code) {
    console.log('Finding card...')
    let card = this.findCard(code)

    if (!card) {
      console.log('Card not found. Adding as missing card')
      this.addMissingCard(code)
      return
    }

    console.log(`Found card: ${card.title}. Processing...`)
    this.processCard(card)
  }

  findCard(code) {
    const data = fs.readFileSync(__dirname + '/../config/cards.json').toString()
    const cards = JSON.parse(data)

    const card = cards.find(c => c.code === code)
    return card
  }

  addMissingCard(code) {
    const data = fs.readFileSync(__dirname + '/../config/cards.json').toString()
    let d = new Date();
    
    fs.writeFileSync(__dirname + '/../config/cards.json', data.replace(']',',{"code": "' + code + '","type": "","action": "","artURL": "","title": "Unknown card ' + code + '","subtitle": "Scanned at ' + d.toString() +'","uri": "","id": ' + d.getTime() +'}]'))
  }
  
  processCard(card) {
    const actionData = fs.readFileSync(__dirname + '/../config/actions.json').toString()
    const actions = JSON.parse(actionData)
    let action = actions[card.action]

    if (!action) {
      console.log(`Action not found: ${card.action}`)
      return
    }

    console.log(`Processing action: ${card.action}`)

    let actionProcessor

    if (action.type === 'sonos') {
      actionProcessor = new SonosAction(card, action)
    } else if (action.type === 'home_assistant') {
      actionProcessor = new HomeAssistantAction(card, action)
    } else if (action.type === 'channels') {
      actionProcessor = new ChannelsAction(card, action)
    } else if (action.type === 'script') {
      actionProcessor = new ScriptAction(card, action)
    }

    if (actionProcessor) {
      actionProcessor.process()
    }
  }
}

let cardProcessor = new CardProcessor()

module.exports = cardProcessor
