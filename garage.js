const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://broker.hivemq.com')

let state = 'closed'

client.on('connect',()=>{
  //open open and close topics listeners
  client.subscribe('garage/open')
  client.subscribe('garage/close')

  ///Inform controller that garage is connected.
  //garage/connected is a topic or channel in which communication will be established
  client.publish('garage/connected','true')

  //Send state of door after it's connected
  sendStateUpdate()
})
//Message listener
client.on('message',(topic,message)=>{
  console.log('received message %s',topic, message)

  switch(topic){
    case 'garage/open':
      return handleOpenRequest(message)
    case 'garage/close':
      return handleCloseRequest(message)
  }
})

//function to send the current state of the door
function sendStateUpdate(){
  console.log('sending state %s', state)
  client.publish('garage/state', state)
}

function handleOpenRequest(message){
  if(state !== 'open' && state !== 'opening'){
    console.log('opening garage door')
    state = 'opening'
    sendStateUpdate()

    //Simulate door open after 5 secods (would be listening for hardware)
    setTimeout(()=>{
      state = 'open'
      sendStateUpdate()
    },5000)
  }
}

function handleCloseRequest(message){
  if (state !== 'closed' && state !== 'closing'){
    state = 'closing'
    sendStateUpdate()

    //simulate door closed after 5 seconds (would be listening to hardware)
    setTimeout(()=>{
      state = 'closed'
      sendStateUpdate()
    }, 5000)
  }
}

//Notify controller that garage is disconnected before shutting down

function handleAppExit(options, err){
  if (err){
    console.log(err.stack)
  }
  if (options.cleanup){
    client.publish('garage/connected','false')
  }
  if (option.exit){
    process.exit()
  }
}

process.on('exit', handleAppExit.bind(null,{
  cleanup:true
}))

process.on('SIGINT',handleAppExit.bind(null,{
  exit:true
}))
