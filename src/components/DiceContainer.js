import React from 'react';
import DieIcon from './DieIcon';
import DieContainer from './DieContainer';
import { DICE__TAKE_DIE, DICE__PUT_BACK, DICE__SET_DIE } from '../SocketEvents';

const GREEN  = "green";
const PURPLE = "purple";
const ORANGE = "orange";

class DiceContainer extends React.Component {
  constructor(props) {
    super(props);

    const diceInBag = [];
    const numDicePerColor = 4;
    [GREEN, PURPLE, ORANGE].forEach((color) => {
      for (let i=0; i < numDicePerColor; i++) {
        const die = {
          color,
          id: this.props.username + "_" + color + i,
          value: null
        };
        diceInBag.push(die);
      }
    });

    this.state = {
      diceInBag,
      diceOnTable: [],
    };
  }

  componentDidMount() {
    const { socket, username } = this.props;

    const takeDieEvent = `${DICE__TAKE_DIE}-${username}`;
    socket.on(takeDieEvent, (die) => {
      console.log(`${takeDieEvent}`);
      console.log(die);
      this.takeDie(die)
    });

    const putBackEvent = `${DICE__PUT_BACK}-${username}`;
    socket.on(putBackEvent, (die) => {
      console.log(`${putBackEvent}`);
      console.log(die);
      this.putBack(die)
    });

    const setDieEvent = `${DICE__SET_DIE}-${username}`;
    socket.on(setDieEvent, (die, newValue) => {
      console.log(`${setDieEvent}`);
      console.log(die);
      this.setDie(die, newValue)
    });
  }



  // Move die from diceInBag to diceOnTable.
  takeDie = (die) => {
    this.setState((prevState, prevProps) => ({
      diceInBag: prevState.diceInBag.filter(d => d.id !== die.id),
      diceOnTable: [...prevState.diceOnTable, die]
    }));
  }

  drawDieAndAnnounce = () => {
    const { diceInBag } = this.state;
    const rand = Math.floor(Math.random() * diceInBag.length);
    const die = diceInBag[rand];

    this.takeDie(die);
    this.props.socket.emit(DICE__TAKE_DIE, die);
    console.log(die);
  }

  // Move die from diceOnTable to diceInBag.
  putBack = (die) => {
    const newDie = {...die, value: null}
    this.setState((prevState, prevProps) => ({
      diceInBag: [...prevState.diceInBag, newDie],
      diceOnTable: prevState.diceOnTable.filter(d => d.id !== newDie.id)
    }));
  }

  putBackAndAnnounce = (die) => {
    this.putBack(die);
    this.props.socket.emit(DICE__PUT_BACK, die);
  }

  // Sets the value of a die that is on the table. Note that all dice in the bag
  // have value null so they aren't considered.
  setDie = (die, newValue) => {
    this.setState((prevState, prevProps) => {
      console.log(newValue);
      const { diceOnTable } = prevState;
      const updatedList = [];
      diceOnTable.forEach((d) => {
        if (d.id === die.id) {
          const updatedDie = { ...die, value: newValue };
          updatedList.push(updatedDie);
        } else {
          updatedList.push(d);
        }
      });
      console.log(updatedList);
      return { diceOnTable: updatedList };
    });
  }

  setDieAndAnnounce = (die, newValue) => {
    this.setDie(die, newValue);
    this.props.socket.emit(DICE__SET_DIE, die, newValue);
  }



  render() {
    const { username, isForThisUser } = this.props;
    const { diceInBag, diceOnTable } = this.state;

    let diceOnTableRendered;
    if (isForThisUser) {
      diceOnTableRendered = diceOnTable.map((die) => (
        <DieContainer
          key={die.id}
          die={die}
          putBack={this.putBackAndAnnounce}
          setDie={this.setDieAndAnnounce}
          />
      ));
    } else {
      diceOnTableRendered = diceOnTable.map((die) => (
        <DieIcon key={die.id} die={die} />
      ));
    }


    return (
      <div className="DiceContainer">
        <h3>{`${username}'s dice`}</h3>

        <div className="DiceInBagContainer">
          <p>Dice in bag:</p>
          {diceInBag.map(die => <DieIcon key={die.id} die={die} />)}
        </div>

        {
          isForThisUser &&
          <button
            onClick={this.drawDieAndAnnounce}
            disabled={diceInBag.length===0}
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
