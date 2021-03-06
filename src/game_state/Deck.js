const initHorizonDeck = () => {
  const nums = [...Array(10).keys()];
  const drawPile = nums.map(i => ({
    id: "card"+i,
    num: i,
  }));
  const discardPile = [];
  return { drawPile, discardPile };
}

const drawCard = (drawPile, hand) => {
  const topCard = drawPile[drawPile.length - 1];
  return {
    newDrawPile: drawPile.slice(0,-1),
    newHand: [...hand, topCard]
  };
}

module.exports = { initHorizonDeck, drawCard };
