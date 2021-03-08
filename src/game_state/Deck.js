const initHorizonDeck = () => {
  const nums = [...Array(15).keys()];
  let horizonDrawPile = nums.map(i => (Object.freeze({
    id: "card"+i,
    num: i,
  })));
  horizonDrawPile = shuffle(horizonDrawPile);
  const horizonDiscardPile = [];
  return { horizonDrawPile, horizonDiscardPile };
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
