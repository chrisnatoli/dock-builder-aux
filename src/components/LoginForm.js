import React from 'react';
import { VERIFY_USER } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      error: ""
    };
  }

  handleChange = (event) => {
    this.setState({ username: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(`Sending VERIFY_USER request with username ${this.state.username}`);
    this.props.socket.emit(VERIFY_USER, this.state.username);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="loginForm">
          <label htmlFor="username">
            Name:
            <input
              type="text"
              id="username"
              value={this.state.username}
              onChange={this.handleChange}
              />
          </label>
          <input type="submit" value="Submit" />
          <div className="error">
            {this.state.error}
          </div>
        </form>
      </div>
    );
  }
}

export default LoginForm;
