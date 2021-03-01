import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import GameLog from './components/GameLog';
import DiceContainer from './components/DiceContainer';

import {
  USER_RECONNECTED,
  USER_LOGGED_IN,
  RESTORE_STATE,
  UPDATE_USERNAME_LIST,
  UPDATE_DICE,
} from './SocketEvents';

//const socketUrl = "/";                        // FOR BUILD
const socketUrl = "http://192.168.0.101:3030"; // FOR DEVELOPMENT

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      username: null,
      usernameList: [],
      diceDict: new Map(),
    };
  }

  componentDidMount() {
    const socket = io(socketUrl);
    this.setState({ socket });

    socket.on('connect', () => {
      if (this.state.username) {
        socket.emit(USER_RECONNECTED, this.state.username);
        console.log(`Reconnected to server, my socket ID is ${socket.id}`);
      } else {
        console.log(`Connected to server, my socket ID is ${socket.id}`);
      }
    });

    socket.on(RESTORE_STATE, username => this.setState({ username }));

    socket.on(UPDATE_USERNAME_LIST,
      usernameList => this.setState({ usernameList })
    );

    socket.on(UPDATE_DICE, (username, dice) => {
      this.setState((prevState) => {
        const copy = new Map(prevState.diceDict);
        copy.set(username, dice);
        return { diceDict: copy };
      });
    });
  }

  setUsername = (username) => {
    this.setState({ username });
    this.state.socket.emit(USER_LOGGED_IN, username);
  }

  sendAhoy = () => {
    this.state.socket.emit('ahoy', this.state.username);
  }

  render() {
    const { socket, username, usernameList, diceDict } = this.state;
    let otherUsernames;
    if (username) {
      otherUsernames = usernameList.filter(u => u !== username);
    }

    return (
      <div className="App">
        {
          !username
          ?
          <LoginForm socket={socket} setUsername={this.setUsername} />
          :
          <div className="layout">
            <span>Logged in! Welcome {username}.</span>
            <div>Players: {usernameList.join(', ')}</div>

            <DiceContainer
              socket={socket}
              username={username}
              dice={diceDict.get(username)}
              isForThisUser={true}
              />

            <div className="DiceContainersForOtherUsers">
              {
                otherUsernames.map((username) => (
                  <DiceContainer
                    key={username}
                    socket={socket}
                    username={username}
                    dice={diceDict.get(username)}
                    isForThisUser={false}
                    />
                ))
              }
            </div>

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
