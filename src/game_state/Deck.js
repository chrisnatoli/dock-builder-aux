const initHorizonDeck = () => {
  const nums = [...Array(10).keys()];
  const drawPile = nums.map(i => ({
    id: "card"+i,
    num: i,
  }));
  const discardPile = [];
  return { drawPile, discardPile };
}

module.exports = { initHorizonDeck };
