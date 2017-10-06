import React, {Component} from 'react';

class Message extends Component {
  render() {
    return (
      <div className="message">
        <span className="message-username" style={{color: this.props.user.clientColour}}>{this.props.msg.username}</span>
        <span className={this.props.msg.type === 'incomingNotification' ? "message system":"message-content"}>
        {this.props.msg.message}
        <img className="message-img"src={this.props.msg.img}/>
        </span>
      </div>
    );
  }
}
export default Message;