import React from 'react';
import { GAME_LOG_MESSAGE } from '../SocketEvents';

class GameLog extends React.Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = { gameLogMessages: [] }
  }

  componentDidMount() {
    this.props.socket.on(GAME_LOG_MESSAGE,
      (gameLogMessages) => this.setState({ gameLogMessages })
    );
  }

  componentDidUpdate() {
    this.scrollDown()
  }

  scrollDown = () => {
    const c = this.container.current;
    c.scrollTop = c.scrollHeight;
  }

  render() {
    return (
      <div className="GameLog container">
        <h3>Game Log</h3>
        <div className="LogMessageContainer" ref={this.container}>
          {
            this.state.gameLogMessages.map((message, index) => (
              <div key={index} className="LogMessage">{message}</div>
            ))
          }
        </div>
      </div>
    );
  }
}

export default GameLog;
