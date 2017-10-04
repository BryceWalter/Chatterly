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

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on('connection', (ws) => {
  console.log('Client connected');

ws.on('message', function incoming(data) {
  var inData = JSON.parse(data)
  switch(inData.type) {
    case 'postMessage' :
      console.log(`User ${inData.username} said ${inData.message}`);
      var outMessage = {
        type: 'incomingMessage',
        id: uuidv1(),
        username: inData.username,
        message: inData.message
      }
      wss.clients.forEach(function each(client) {
          client.send(JSON.stringify(outMessage))
      })
      break;

    case 'postNotification':
      console.log(`User(x) changed their username to ${inData.currentUser.name}`)
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
  ws.on('close', () => console.log('Client disconnected'));
});