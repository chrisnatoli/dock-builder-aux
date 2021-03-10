import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import GameLog from './components/GameLog';
import DiceContainer from './components/DiceContainer';
import HorizonDeck from './components/HorizonDeck';
import HorizonHand from './components/HorizonHand';

import {
  USER_LOGGED_IN,
  USER_RECONNECTED,
  LOG_BACK_IN,
  UPDATE_USERNAME_LIST,
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

    socket.on(LOG_BACK_IN, username => this.setState({ username }));

    socket.on(UPDATE_USERNAME_LIST,
      usernameList => this.setState({ usernameList })
    );
  }

  setUsername = (username) => {
    this.setState({ username });
    this.state.socket.emit(USER_LOGGED_IN, username);
  }

  sendAhoy = () => {
    this.state.socket.emit('ahoy', this.state.username);
  }

  render() {
    const { socket, username, usernameList } = this.state;

    let opponents;
    if (username) {
      opponents = usernameList.filter(u => u !== username);
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
              isForThisUser={true}
              />

            <div className="DiceContainersForOpponents">
              {
                opponents.map((username) => (
                  <DiceContainer
                    key={username}
                    socket={socket}
                    username={username}
                    isForThisUser={false}
                    />
                ))
              }
            </div>

            <HorizonDeck
              socket={socket}
              numPlayers={usernameList.length}
              />

            <HorizonHand
              socket={socket}
              username={username}
              />

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
