// server.js

const express = require('express');
const SocketServer = require('ws').Server;
const uuidv1 = require('uuid/v1');

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
   // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static('public'))
  .listen(PORT, '0.0.0.0', 'localhost', () => console.log(`Listening on ${ PORT }`));

// Create the WebSockets server
const wss = new SocketServer({ server });
const clientId = uuidv1()
const messageId = uuidv1()
function clientColour() {
  var letters = '0123456789ABCDEF'.split('');
  var colour = '#';
  for (var i = 0; i < 6; i++ ) {
  colour += letters[Math.round(Math.random() * 15)];
}
  return colour;
}

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');
  console.log(clientColour())
  console.log('Current online clients:'  + wss.clients.size)
  var clientList = {
    type: 'incomingClientList',
    userCount: wss.clients.size,
    currentUser:{
    id: clientId,
    name: "Anonyomus1",
    clientColour: clientColour()
    }
  }
  wss.clients.forEach(function each(client){
    client.send(JSON.stringify(clientList))

  })

ws.on('message', function incoming(data) {
  var inData = JSON.parse(data)
  switch(inData.type) {
    case 'postMessage' :
      console.log(inData.img)
      console.log(`User ${inData.username} said ${inData.message}`);
      var outMessage = {
        type: 'incomingMessage',
        id: messageId,
        username: inData.username,
        message: inData.message,
        img: inData.img

      }
      wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(outMessage))
      })
      break;

    case 'postNotification':
      console.log(`User changed their username to ${inData.currentUser.name}`)
      var outNotification = {
        type: 'incomingNotification',
        currentUser: inData.currentUser
      }
      wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(outNotification))
      })
      break;

    default:
      throw new Error("Unknown event type" + inData.type)
  }
})


  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on('close', () => {
    console.log('Client disconnected')
    var clientList = {
    type: 'incomingClientList',
    userCount: wss.clients.size
    }
    wss.clients.forEach(function each(client){
      client.send(JSON.stringify(clientList))
    })
  });
});