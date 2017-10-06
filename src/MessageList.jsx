import React, {Component} from 'react';
import Message from './Message.jsx'

class MessageList extends Component {
  render() {
    const listMessages = this.props.messages.map((msg, index) => {
      return <Message user={this.props.user} key={index} msg={msg} />
    })

    return (
      <main className="messages">
        {listMessages}
      </main>
    );
  }
}
export default MessageList;