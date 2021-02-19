import React from 'react';
import './index.css';
import io from 'socket.io-client';

const socketUrl = "http://192.168.0.101:3030";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: null
    };
  }

  componentDidMount() {
    const socket = io(socketUrl);
    socket.on('connect', () => {
      console.log("Connected");
    });
    this.setState({ socket });
  }

  render() {
    return (
      <div className="App">
        app
      </div>
    );
  }
}

export default App;
