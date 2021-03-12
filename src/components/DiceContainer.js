import React from 'react';
import DieIcon from './DieIcon';
import DieContainer from './DieContainer';
import {
  DICE__DRAW_DIE,
  DICE__ENABLE_DRAW,
  DICE__UPDATE,
} from '../SocketEvents';

class DiceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dice: [],
      isDrawingEnabled: false,
    }
  }

  componentDidMount() {
    const socket = this.props.socket;

    socket.on(DICE__ENABLE_DRAW,
      isDrawingEnabled => this.setState({ isDrawingEnabled })
    );

    socket.on(DICE__UPDATE, (username, dice) => {
      if (this.props.username === username) { // TO DO
        this.setState({ dice });
      }
    });
  }

  drawDie = () => {
    const diceInBag = this.state.dice.filter(d => !d.isOnTable);
    const rand = Math.floor(Math.random() * diceInBag.length);
    const die = diceInBag[rand];
    this.props.socket.emit(DICE__DRAW_DIE, die);
  }

  render() {
    const { socket, username, isForThisUser } = this.props;
    const { dice, isDrawingEnabled } = this.state;

    let diceInBag = [], diceOnTable = [];
    if (dice) {
      diceInBag = dice.filter(d => !d.isOnTable);
      diceOnTable = dice.filter(d => d.isOnTable);
    }

    let diceOnTableRendered;
    if (isForThisUser) {
      diceOnTableRendered = diceOnTable.map((die) => (
        <DieContainer
          key={die.id}
          socket={socket}
          die={die}
          />
      ));
    } else {
      diceOnTableRendered = diceOnTable.map((die) => (
        <DieIcon key={die.id} die={die} />
      ));
    }


    return (
      <div className="DiceContainer container">
        <h3>{`${username}'s dice`}</h3>

        <div className="DiceInBagContainer">
          <p>Dice in bag:</p>
          {diceInBag.map(die => <DieIcon key={die.id} die={die} />)}
        </div>

        {
          isForThisUser &&
          <button
            disabled={diceInBag.length===0 || !isDrawingEnabled}
            onClick={this.drawDie}
            >
            Draw
          </button>
        }

        <div className="DiceOnTableContainer">
          <p>Dice on table:</p>
          {diceOnTableRendered}
        </div>
      </div>
    );
  }
}

export default DiceContainer;
