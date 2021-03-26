import React from 'react';
import DieIcon from './DieIcon';
import DieContainer from './DieContainer';
import {
  DICE__DRAW_DIE,
  DICE__ENABLE_DRAWING,
  DICE__UPDATE,
} from '../SocketEvents';

class DiceContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dice: [],
      isDrawingEnabled: false,
    };
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on(DICE__ENABLE_DRAWING, (isDrawingEnabled) => (
      this.setState({ isDrawingEnabled })
    ));

    socket.on(DICE__UPDATE, (username, dice) => {
      const { username: thisUsername } = this.props;
      if (thisUsername === username) {
        this.setState({ dice });
      }
    });
  }

  drawDie = () => {
    const { dice } = this.state;
    const { socket } = this.props;
    const diceInBag = dice.filter((d) => !d.isOnTable);
    const rand = Math.floor(Math.random() * diceInBag.length);
    const die = diceInBag[rand];
    socket.emit(DICE__DRAW_DIE, die);
  }

  render() {
    const { socket, username, isForThisUser } = this.props;
    const { dice, isDrawingEnabled } = this.state;
    const flexboxClass = isForThisUser ? 'ThisUser' : 'Opponent';

    let diceInBag = [];
    let diceOnTable = [];
    if (dice) {
      diceInBag = dice.filter((d) => !d.isOnTable);
      diceOnTable = dice.filter((d) => d.isOnTable);
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

        <div className={`DiceFlexbox ${flexboxClass}`}>
          <div className={`DiceInBagContainer ${flexboxClass}`}>
            <p>Dice in bag</p>
            {diceInBag.map((die) => <DieIcon key={die.id} die={die} />)}
            {
              isForThisUser && (
                <button
                  disabled={diceInBag.length === 0 || !isDrawingEnabled}
                  onClick={this.drawDie}
                  type="button"
                >
                  Draw
                </button>
              )
            }
          </div>

          <div className={`DiceOnTableContainer ${flexboxClass}`}>
            <p>Dice on table</p>
            {diceOnTableRendered}
          </div>
        </div>

      </div>
    );
  }
}

export default DiceContainer;
