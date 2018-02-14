const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

//Defined as an empty string as we don't know until we get the message
//from the garage
let garageState = ''
let connected = false

client.on('connect',()=>{
  //when this client is connected we hook up to established garage/connected
  //topic, or other topics that are added.
  client.subscribe('garage/connected')
  client.subscribe('garage/state')

  //subscribe allows to receive messages from the topics (channels)
})

//Listening to the message once is connected. When a message arrives the anpunymous
//function is triggered
client.on('message',(topic, message)=>{

    //if the topic is garage/connected, evaluate if the message sent by yhe device is 'true'
    //If this is the case change the local connected to true, if not it'll be false
    switch(topic){
      case 'garage/connected':
        return handleGarageConnected(message)
      case 'garage/state':
        return handleGarageState(message)
    }
    console.log('No handler for topic %s', topic)
})

function handleGarageConnected(message){
  console.log('garage connected status %s', message)
  connected = (message.toString() === 'true')
}
function handleGarageState(message){
  garageState = message
  console.log('garage state update to %s', message)
}
function openGarageDoor(){
  if(connected && garageState !== 'open'){
    //open door
    client.publish('garage/open','true')
  }
}
function closeGarageDoor(){
  if (connected && garageState !== 'closed'){
    client.publish('garage/close','true')
  }
}

//For demo only --> This should be done in a client application
//Simulate opening

//Here the api for the user interaction should be created.

setTimeout(()=>{
  console.log('open door')
  openGarageDoor()
},5000)

//Simulate closing
setTimeout(()=>{
  console.log('close door')
  closeGarageDoor()
}, 20000)
