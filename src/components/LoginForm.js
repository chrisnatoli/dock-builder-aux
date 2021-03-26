import React from 'react';
import { PropTypes } from 'prop-types';
import { CHECK_USERNAME, USER_RECONNECTED } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.state = {
      username: '',
      error: '',
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
    const { socket } = this.props;
    const { username } = this.state;
    socket.emit(CHECK_USERNAME, username, this.handleUsernameCheck);
  }

  handleUsernameCheck = (username, error) => {
    const { setUsername } = this.props;
    switch (error) {
      case 'USER_DISCONNECTED':
        this.setState({
          logBackInAs: username,
          error: 'A user with this name had disconnected. '
                 + `Are you trying to log back in as ${username}?`,
        });
        break;
      case 'GAME_ALREADY_STARTED':
        this.setState({ error: 'Sorry, the game has already started.' });
        break;
      case 'USERNAME_TAKEN':
        this.setState({ error: 'This username is already taken.' });
        break;
      case 'USERNAME_BLANK':
        this.setState({ error: 'Your username cannot be blank.' });
        break;
      default:
        this.setState({ error: '', logBackInAs: null });
        setUsername(username);
    }
  }

  handleLogBackIn = () => {
    const { logBackInAs } = this.state;
    const { socket } = this.props;
    const username = logBackInAs;
    socket.emit(USER_RECONNECTED, username);
  }

  render() {
    const { username, error, logBackInAs } = this.state;
    return (
      <div>
        <form onSubmit={this.handleSubmit} className="LoginForm">
          <label htmlFor="username">
            Name:
            <input
              type="text"
              id="username"
              value={username}
              onChange={this.handleChange}
              ref={this.textInput}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>

        <div className="error">
          {error}
          {
            logBackInAs && (
              <button
                onClick={this.handleLogBackIn}
                type="button"
              >
                Log back in
              </button>
            )
          }
        </div>
      </div>
    );
  }
}

LoginForm.propTypes = {
  socket: PropTypes.object,
  setUsername: PropTypes.func.isRequired,
};
LoginForm.defaultProps = {
  socket: null,
};

export default LoginForm;
