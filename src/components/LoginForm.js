import React from 'react';
import { CHECK_USERNAME, USER_RECONNECTED } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      error: "",
      logBackInAs: ""
    };
  }

  handleChange = (event) => {
    this.setState({ username: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.socket.emit(CHECK_USERNAME,
      this.state.username,
      this.handleUsernameCheck
    );
  }

  handleUsernameCheck = (username, isUsernameTaken, isDisconnectedUser) => {
    if (isUsernameTaken) {
      this.setState({ error: "This username is already taken." });
    } else if (isDisconnectedUser) {
      this.setState({ error:
        `A user with this name had disconnected. Are you trying to log back in as ${username}?`
      });
      this.setState({ logBackInAs: username });
    } else {
      this.setState({ error: "", logBackInAs: "" });
      this.props.setUsername(username);
    }
  }

  handleLogBackIn = () => {
    const username = this.state.logBackInAs;
    console.log(`Logging back in as ${username}`);
    this.props.socket.emit(USER_RECONNECTED, username);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="loginForm">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            value={this.state.username}
            onChange={this.handleChange}
            />
          <input type="submit" value="Submit" />
        </form>

        <div className="error">
          {this.state.error}
          { this.state.logBackInAs
            ? <button onClick={this.handleLogBackIn}>Log back in</button>
            : null
          }
        </div>
      </div>
    );
  }
}

export default LoginForm;
