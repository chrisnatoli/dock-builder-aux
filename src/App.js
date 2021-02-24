import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import { USER_RECONNECTED } from './SocketEvents';

//const socketUrl = "/";                        // FOR BUILD
const socketUrl = "http://192.168.0.101:3030"; // FOR DEVELOPMENT

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
      if (this.state.username) {
        socket.emit(USER_RECONNECTED, this.state.username);
        console.log(`Reconnected to server, my socket ID is ${socket.id}`);
      } else {
        console.log(`Connected to server, my socket ID is ${socket.id}`);
      }
    });
    this.setState({ socket });
  }

  setUsername = (username) => {
    this.setState({ username });
  }

  render() {
    const { socket, username } = this.state;
    return (
      <div className="App">
        {
          !username
          ?
          <LoginForm socket={socket} setUsername={this.setUsername} />
          :
          <div className="layout">
            <span>Logged in! Welcome {username}.</span>
            <UserList socket={socket} />
          </div>
        }
      </div>
    );
  }
}

export default App;
