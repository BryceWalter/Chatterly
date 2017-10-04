import React, {Component} from 'react';
import NavBar from './NavBar.jsx'
import ChatBar from './ChatBar.jsx';
import MessageList from './MessageList.jsx'
import Message from './Message.jsx'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    currentUser: {name: "Bob"},
    messages: []
    }
  }
  componentDidMount() {
  this.chattySocket = new WebSocket("ws://localhost:3001");
  console.log("Connected to server!")
}
  render() {
    return (
      <div>
        <NavBar></NavBar>
        <MessageList messages={this.state.messages} user={this.state.currentUser.name}/>
        <ChatBar currentUser={this.state.currentUser.name} submitUserInput={this.handleUserInput} submitUserChange={this.handleUserChange}/>
      </div>
    );
  }

  handleUserChange = (username) => {
    let newUser = {
      type: 'postNotification',
      currentUser: username.currentUser
    }
    this.chattySocket.send(JSON.stringify(newUser))

    // this.setState({currentUser: newUser}, () =>{
    //   console.log(this.state.currentUser)
    // })
  }

  handleUserInput = (message) => {
    let msg = {
      type: 'postMessage',
      username: message.username,
      message: message.content
    }
    this.chattySocket.send(JSON.stringify(msg))

    this.chattySocket.onmessage = (e) => {
      const data  = JSON.parse(e.data)
      switch(data.type) {
        case 'incomingMessage':
          this.setState({messages: [ ... this.state.messages, data]})
          break;
        case 'incomingNotification':
          console.log(data)
          this.setState({currentUser: data.currentUser})
          break;

        default:
          throw new Error("Unknown event type " + data.type);
      }
    }

  }
}


export default App;
