import React from 'react';
import DieIcon from './DieIcon';
import DieContainer from './DieContainer';

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

  drawDie = () => {
    if (this.state.diceInBag.length > 0) {
      this.setState((prevState, prevProps) => {
        const { diceInBag, diceOnTable } = prevState;
        const rand = Math.floor(Math.random() * diceInBag.length);
        const die = diceInBag[rand];
        return {
          diceInBag: diceInBag.filter(d => d !== die),
          diceOnTable: [...diceOnTable, die]
        };
      });
    }
  }

  putBack = (die) => {
    const newDie = {...die, value: null}
    this.setState((prevState, prevProps) => {
      const { diceInBag, diceOnTable } = prevState;
      return {
        diceInBag: [...diceInBag, newDie],
        diceOnTable: diceOnTable.filter(d => d.id !== newDie.id)
      }
    });
  }

  // Sets the value of a die that is on the table. Note that all dice in the bag
  // have value null.
  setDie = (die, newValue) => {
    this.setState((prevState, prevProps) => {
      const { diceOnTable } = prevState;
      const updatedList = [];
      diceOnTable.forEach((d) => {
        if (d === die) {
          const updatedDie = { ...die, value: newValue };
          updatedList.push(updatedDie);
        } else {
          updatedList.push(d);
        }
      });
      return { diceOnTable: updatedList };
    });
  }

  render() {
    const { diceInBag, diceOnTable } = this.state;
    return (
      <div className="DiceContainer">
        <div className="DiceInBagContainer">
          <p>Dice in bag:</p>
          {diceInBag.map(die => <DieIcon key={die.id} die={die} />)}
        </div>

        <button onClick={this.drawDie}>Draw</button>

        <div className="DiceOnTableContainer">
          <p>Dice on table:</p>
          {
            diceOnTable.map((die) => (
              <DieContainer
                key={die.id}
                socket={this.props.socket}
                die={die}
                putBack={this.putBack}
                setDie={this.setDie}
                />
            ))
          }
        </div>

      </div>
    );
  }
}

export default DiceContainer;
