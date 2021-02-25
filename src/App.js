import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import GameLog from './components/GameLog';
import DiceContainer from './components/DiceContainer';

import {
  USER_RECONNECTED,
  USER_LOGGED_IN,
  USER_DATA
} from './SocketEvents';

const socketUrl = "/";                        // FOR BUILD
//const socketUrl = "http://192.168.0.101:3030"; // FOR DEVELOPMENT

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      user: null
    };
  }

  componentDidMount() {
    const socket = io(socketUrl);

    socket.on('connect', () => {
      if (this.state.user) {
        socket.emit(USER_RECONNECTED, this.state.user.name);
        console.log(`Reconnected to server, my socket ID is ${socket.id}`);
      } else {
        console.log(`Connected to server, my socket ID is ${socket.id}`);
      }
    });

    socket.on(USER_DATA, user => this.setState({ user }));

    this.setState({ socket });
  }

  createUser = (name) => {
    const user = { name };
    this.setState({ user });
    this.state.socket.emit(USER_LOGGED_IN, user);
  }

  sendAhoy = () => {
    this.state.socket.emit('ahoy', this.state.user.name);
  }

  render() {
    const { socket, user } = this.state;
    return (
      <div className="App">
        {
          !user
          ?
          <LoginForm socket={socket} createUser={this.createUser} />
          :
          <div className="layout">
            <span>Logged in! Welcome {user.name}.</span>
            <UserList socket={socket} />
            <DiceContainer socket={socket} />
            <GameLog socket={socket} />
            <br />
            <button onClick={this.sendAhoy}>Ahoy!</button>
          </div>
        }
      </div>
    );
  }
}

export default App;
