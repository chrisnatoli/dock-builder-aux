import React from 'react';
import { VERIFY_USERNAME } from '../SocketEvents';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      error: ""
    };
  }

  handleChange = (event) => {
    this.setState({ name: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.socket.emit(VERIFY_USERNAME,
      this.state.name,
      this.handleVerification
    );
  }

  handleVerification = (name, isNameTaken) => {
    if (isNameTaken) {
      this.setState({ error: "This name is already taken." });
    } else {
      this.setState({ error: "" });
      this.props.createUser(name);
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
