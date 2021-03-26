const initDice = (username) => (
  ['green', 'purple', 'orange'].map((color) => {
    const diceOfOneColor = [0, 1, 2, 3].map((i) => {
      const die = {
        id: `${username}_${color}${i}`,
        color,
        value: null,
        isOnTable: false,
      };
      return die;
    });
    return diceOfOneColor;
  }).flat()
);

const drawDie = (dice, die) => (
  dice.map((d) => (
    (d.id === die.id) ? { ...d, isOnTable: true } : { ...d }
  ))
);

const putBack = (dice, die) => (
  dice.map((d) => (
    (d.id === die.id) ? { ...d, isOnTable: false, value: null } : { ...d }
  ))
);

const setDie = (dice, die, newValue) => (
  dice.map((d) => (
    (d.id === die.id) ? { ...d, value: newValue } : { ...d }
  ))
);

module.exports = { initDice, drawDie, putBack, setDie };
