import React from 'react';

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
        const die = {
          color,
          value: null,
          key: color + i,
        };
        diceInBag.push(die);
      }
    });

    this.state = {
      diceInBag,
      diceOnTable: [],
    };
  }

  render() {
    const { diceInBag, diceOnTable } = this.state;
    return (
      <div className="DiceContainer">
        <div>
          Dice in bag:
          <br />
          {diceInBag.map(die => {
            return (
              <div key={die.key}>
                {die.key}
              </div>
            );
          })}
        </div>

        <br />
        <div>
          Dice on table:
          <br />
          {diceOnTable.map(die => {
            return (
              <div key={die.key}>
                {die.key}
              </div>
            );
          })}
        </div>

      </div>
    );
  }
}

export default DiceContainer;
