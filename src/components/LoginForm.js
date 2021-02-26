import React from 'react';
import { CHECK_USERNAME, USER_RECONNECTED } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: "",
      logBackInAs: ""
    };
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.socket.emit(CHECK_USERNAME,
      this.state.name,
      this.handleUsernameCheck
    );
  }

  handleUsernameCheck = (name, isNameTaken, isDisconnectedUser) => {
    if (isNameTaken) {
      this.setState({ error: "This name is already taken." });
    } else if (isDisconnectedUser) {
      this.setState({ error:
        `A user with this name had disconnected. Are you trying to log back in as ${name}?`
      })
      this.setState({ logBackInAs: name });
    } else {
      this.setState({ error: "", logBackIn: "" });
      this.props.createUser(name);
    }
  }

  handleLogBackIn = () => {
    console.log(`Logging back in as ${this.state.logBackInAs}`);
    this.props.socket.emit(USER_RECONNECTED, this.state.logBackInAs);
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
