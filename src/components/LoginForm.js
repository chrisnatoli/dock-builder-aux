import React from 'react';
import { CHECK_USERNAME, USER_RECONNECTED } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      username: "",
      error: "",
      logBackInAs: null,
    };
  }

  componentDidMount() {
    this.textInput.current.focus();
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

  handleUsernameCheck = (username, error) => {
    switch(error) {
      case "USER_DISCONNECTED":
        this.setState({
          logBackInAs: username,
          error: "A user with this name had disconnected. "
                 + `Are you trying to log back in as ${username}?`
        });
        break;
      case "USERNAME_TAKEN":
        this.setState({ error: "This username is already taken." });
        break;
      case "USERNAME_BLANK":
        this.setState({ error: "Your username cannot be blank." });
        break;
      default:
        this.setState({ error: "", logBackInAs: null });
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
        <form onSubmit={this.handleSubmit} className="LoginForm">
          <label htmlFor="username">Name:</label>
          <input
            type="text"
            id="username"
            value={this.state.username}
            onChange={this.handleChange}
            ref={this.textInput}
            />
          <input type="submit" value="Submit" />
        </form>

        <div className="error">
          {this.state.error}
          {
            this.state.logBackInAs
            && <button onClick={this.handleLogBackIn}>Log back in</button>
          }
        </div>
      </div>
    );
  }
}

export default LoginForm;
