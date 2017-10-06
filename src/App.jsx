import React, {Component} from 'react';
import NavBar from './NavBar.jsx'
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx'
import Message from './Message.jsx'

const uuidv1 = require('uuid/v1');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    currentUser: {
    name: "Anonymous1",
    clientColour: ""
    },
    messages: [],
    userCount: 0,
    }
  }
  componentDidMount() {
  this.chattySocket = new WebSocket("ws://localhost:3001");
  console.log("Connected to server!")

    this.chattySocket.onmessage = (e) => {
      const data  = JSON.parse(e.data)
      switch(data.type) {
        case 'incomingMessage':
          console.log(data.img)
          let message = {
            type: 'incomingMessage',
            id: data.id,
            username: data.username,
            message: data.message,
          }
          console.log(message)

          if (data.img) {
            message['img'] = data.img[0]
          }

          console.log(message)
          this.setState({messages: [ ... this.state.messages, message]})
          break;
        case 'incomingNotification':
          var notification = {
            type: data.type,
            id: uuidv1(),
            username: "",
            message: `${this.state.currentUser.name} changed their username to ${data.currentUser.name}`
          }
          this.setState({currentUser: data.currentUser, messages: [ ... this.state.messages, notification]})
          console.log(this.state.currentUser.name)
          break;
        case 'incomingClientList':
          this.setState({currentUser: data.currentUser, userCount: data.userCount})
          console.log(this.state.currentUser.clientColour)
          break;

        default:
          throw new Error("Unknown event type " + data.type);
      }
    }
  }

  render() {
    return (
      <div>

        <NavBar userCount={this.state.userCount} />

        <MessageList messages={this.state.messages}
        user={this.state.currentUser}
        />

        <ChatBar currentUser={this.state.currentUser.name}
         submitUserInput={this.handleUserInput}
         submitUserChange={this.handleUserChange}
        />

      </div>
    );
  }

  handleUserChange = (username) => {
    let newUser = {
      type: 'postNotification',
      currentUser: username.currentUser
    }
    this.chattySocket.send(JSON.stringify(newUser))
  }

  handleUserInput = (message) => {

    function imgURL(content) {
      var imgExtractor = /\b(https?:\/\/\S+(?:png|jpe?g|gif)\S*)\b/
      var imgs = content.match(imgExtractor)
      return imgs
    }
    var img = imgURL(message.content)
    console.log(img)

    let msg = {
      type: 'postMessage',
      username: message.username,
      message: message.content,
      img: img
    }
    this.chattySocket.send(JSON.stringify(msg))
  }
}


export default App;
