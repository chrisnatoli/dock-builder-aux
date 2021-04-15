import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import UsernameList from './components/UsernameList';
import GameLog from './components/GameLog';
import GameInterface from './components/GameInterface';

import {
  USER_LOGGED_IN,
  USER_RECONNECTED,
  LOG_BACK_IN,
  UPDATE_USERNAME_LIST,
  START_GAME,
  VOTE_TO_END_GAME,
  END_GAME,
} from './SocketEvents';

const socketUrl = '/'; // FOR BUILD
// const socketUrl = 'http://192.168.0.101:3030'; // FOR DEVELOPMENT

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null,
      username: null,
      usernameList: [],
      isGameStarted: false,
    };
  }

  componentDidMount() {
    const socket = io(socketUrl);
    this.setState({ socket });

    socket.on('connect', () => {
      const { username } = this.state;
      if (username) {
        socket.emit(USER_RECONNECTED, username);
      }
    });

    socket.on(LOG_BACK_IN, (username) => this.setState({ username }));

    socket.on(UPDATE_USERNAME_LIST, (usernameList) => (
      this.setState({ usernameList })
    ));

    socket.on(START_GAME, (isGameStarted) => (
      this.setState({ isGameStarted })
    ));

    socket.on(END_GAME, () => this.setState({
      username: null,
      usernameList: [],
      isGameStarted: false,
    }));
  }

  setUsername = (username) => {
    this.setState({ username });
    const { socket } = this.state;
    socket.emit(USER_LOGGED_IN, username);
  }

  startGame = () => {
    const { socket } = this.state;
    socket.emit(START_GAME);
  }

  sendAhoy = () => {
    const { socket, username } = this.state;
    socket.emit('ahoy', username);
  }

  endGameVote = () => {
    const { socket } = this.state;
    socket.emit(VOTE_TO_END_GAME);
  }

  render() {
    const { socket, username, usernameList, isGameStarted } = this.state;

    let opponents;
    if (username) {
      opponents = usernameList.filter((u) => u !== username);
    }

    return (
      <div className="App">
        {
          !username
            ? <LoginForm socket={socket} setUsername={this.setUsername} />
            : (
              <div className="Layout">
                <UsernameList username={username} usernameList={usernameList} />

                {
                  isGameStarted
                    ? (
                      <GameInterface
                        socket={socket}
                        username={username}
                        opponents={opponents}
                      />
                    ) : (
                      <button onClick={this.startGame} type="button">
                        Start game
                      </button>
                    )
                }

                <GameLog socket={socket} />
                <button
                  onClick={this.sendAhoy}
                  type="button"
                >
                  Ahoy!
                </button>
                <button
                  onClick={this.endGameVote}
                  type="button"
                >
                  Vote to end the game
                </button>
              </div>
            )
        }
      </div>
    );
  }
}

export default App;
