import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';

const socketUrl = "http://192.168.0.101:3030";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      username: null
    };
  }

  componentDidMount() {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log(`Connected to server, my socket ID is ${socket.id}`);
    });
    // Need on disconnect
    this.setState({ socket });
  }

  setUsername = (username) => {
    this.setState({ username });
  }

  render() {
    return (
      <div className="App">
        <LoginForm
          socket={this.state.socket}
          setUsername={this.setUsername}
        />
      </div>
    );
  }
}

export default App;
