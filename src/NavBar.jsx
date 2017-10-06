import React, {Component} from 'react';

class NavBar extends Component {
  render() {
    console.log("Rendering <App/>")
    return (
      <nav className="navbar">
        <a href="/" className="navbar-brand">Chatterly</a>
        <span className="user-counter">{this.props.userCount} users online</span>
      </nav>
    );
  }
}
export default NavBar;