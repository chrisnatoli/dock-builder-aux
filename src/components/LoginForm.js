import React from 'react';
import { VERIFY_USER, USER_CONNECTED } from '../SocketEvents';

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
    this.props.socket.emit(VERIFY_USER,
      this.state.username,
      this.handleVerification
    );
  }

  handleVerification = (username, isNameTaken) => {
    if (isNameTaken) {
      this.setState({ error: "This username is already taken." });
    } else {
      this.setState({ error: "" });
      this.props.setUsername(username);
      this.props.socket.emit(USER_CONNECTED, username);
    }
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
