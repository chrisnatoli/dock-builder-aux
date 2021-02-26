import React from 'react';
import Die from './Die';
import DieContainer from './DieContainer';

const GREEN  = "green";
const PURPLE = "purple";
const ORANGE = "orange";

class DiceContainer extends React.Component {
  constructor(props) {
    super(props);

    const diceInBag = [];
    const numDiceOfEachColor = 4;
    [GREEN, PURPLE, ORANGE].forEach((color) => {
      for (let i=0; i < numDiceOfEachColor; i++) {
        const die = <Die
          color={color}
          id={this.props.username + "_" + color + i}
          value={null}
          />;
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
    console.log("hi");
    const props = { ...die.props, value: null };
    const newDie = <Die { ...props } />;
    this.setState((prevState, prevProps) => {
      const { diceInBag, diceOnTable } = prevState;
      return {
        diceInBag: [...diceInBag, newDie],
        diceOnTable: diceOnTable.filter(d => d.props.id !== newDie.props.id)
      }
    });
  }

  render() {
    const { diceInBag, diceOnTable } = this.state;
    return (
      <div className="DiceContainer">
        <div className="DiceInBagContainer">
          <p>Dice in bag:</p>
          {
            diceInBag.map((die, index) => (
              <React.Fragment key={die.props.id}>{die}</React.Fragment>
            ))
          }
        </div>

        <button onClick={this.drawDie}>
          Draw
        </button>

        <div className="DiceOnTableContainer">
          <p>Dice on table:</p>
          {
            diceOnTable.map((die) => (
              <DieContainer
                key={die.props.id}
                socket={this.props.socket}
                die={die}
                putBack={this.putBack}
                />
            ))
          }
        </div>

      </div>
    );
  }
}

export default DiceContainer;
