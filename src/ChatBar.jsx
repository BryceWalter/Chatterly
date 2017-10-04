import React, {Component} from 'react';

class ChatBar extends Component {
  constructor(props) {
    super(props);
    this.state = {username: "", content: ""}
  }

  handleTextChange = (e) => {
    this.setState({content: e.target.value})
  }

  handleUserChange = (e) => {
    this.setState({username: e.target.value})
  }

  handleUserKeyPress = (e) => {
    if (e.key == 'Enter') {
    debugger;
      let newUser = {currentUser: {name: this.state.username}}
      this.props.submitUserChange(newUser)
    }
  }

  handleMessageKeyPress = (e) => {
    if (e.key == 'Enter') {
      let message = {username: this.state.username,
      content: this.state.content}
      this.props.submitUserInput(message)
      this.setState({content: ""})
    }
  }

  render() {
    return (
      <footer className="chatbar">
        <input className="chatbar-username" placeholder="Your Name" defaultValue={this.state.username} onChange={this.handleUserChange} onKeyPress={this.handleUserKeyPress}/>
        <input className="chatbar-message" placeholder="Enter message here" value={this.state.content} onChange={this.handleTextChange} onKeyPress={this.handleMessageKeyPress}/>
      </footer>
    );
  }
}
export default ChatBar;