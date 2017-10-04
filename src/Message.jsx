import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      <div className="message">
        <span className="message-username">{this.props.msg.username}</span>
        <span className="message-content">{this.props.msg.message}</span>
        <div className="message system">
            Anonymous1 changed their name to nomnom.
        </div>
      </div>
    );
  }
}
export default Message;