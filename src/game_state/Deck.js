const initHorizonDeck = () => {
  const nums = [...Array(10).keys()];
  let drawPile = nums.map(i => ({
    id: "card"+i,
    num: i,
  }));
  drawPile = shuffle(drawPile);
  const discardPile = [];
  return { drawPile, discardPile };
}

const shuffle = (deck) => {
  let newDeck = [...deck];
  let n = deck.length;

  while (n) {
    const i = Math.floor(Math.random() * n);
    n--;
    [newDeck[i], newDeck[n]] = [newDeck[n], newDeck[i]];
  }

  return newDeck;
}

const drawCard = (drawPile, hand) => {
  const topCard = drawPile[drawPile.length - 1];
  return {
    newDrawPile: drawPile.slice(0,-1),
    newHand: [...hand, topCard]
  };
}

module.exports = { initHorizonDeck, drawCard };
