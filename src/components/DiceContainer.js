import React from 'react';
import Die from './Die';

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
        const die = <Die dieColor={color} dieId={color + i} />;
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
          {diceInBag}
        </div>

        <br />
        <div>
          Dice on table:
          <br />
          {diceOnTable}
        </div>

      </div>
    );
  }
}

export default DiceContainer;
