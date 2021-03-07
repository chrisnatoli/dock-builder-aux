import React from 'react';
import './index.css';
import io from 'socket.io-client';
import LoginForm from './components/LoginForm';
import GameLog from './components/GameLog';
import DiceContainer from './components/DiceContainer';
import HorizonDeckContainer from './components/HorizonDeckContainer';

import {
  USER_LOGGED_IN,
  USER_RECONNECTED,
  LOG_BACK_IN,
  UPDATE_USERNAME_LIST,
  UPDATE_HORIZON_DECK,
  UPDATE_HORIZON_HAND,
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
      horizonDeck: { drawPile: [], discardPile: [] },
      horizonHands: new Map()
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

    socket.on(UPDATE_HORIZON_DECK,
      horizonDeck => this.setState({ horizonDeck })
    );

    socket.on(UPDATE_HORIZON_HAND, (username, hand) => {
      this.setState((prevState) => {
        const oldHands = prevState.horizonHands;
        let newHands;

        // Since an opponent's hand is private information, only record the size
        // of an opponent's hand.
        if (username === this.state.username) {
          newHands = new Map([...oldHands, [username, hand]]);
        } else {
          newHands = new Map([...oldHands, [username, hand.length]]);
        }

        return { horizonHands: newHands };
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
    const { socket,
      username,
      usernameList,
      horizonDeck,
      horizonHands,
    } = this.state;

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

            <HorizonDeckContainer
              socket={socket}
              username={username}
              deck={horizonDeck}
              hands={horizonHands}
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
