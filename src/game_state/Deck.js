const initHorizonDeck = () => {
  let nums = [...Array(15).keys()].map(i => i+1);
  let horizonDrawPile = nums.map(i => (Object.freeze({
    id: "card"+i,
    num: i,
  })));
  horizonDrawPile = shuffle(horizonDrawPile);

  nums = nums.map(i => i+15);
  const horizonDiscardPile = nums.map(i => (Object.freeze({
    id: "card"+i,
    num: i,
  })));

  return { horizonDrawPile, horizonDiscardPile };
}

const shuffle = (cards) => {
  let newCards = [...cards];
  let n = cards.length;

  while (n) {
    const i = Math.floor(Math.random() * n);
    n--;
    [newCards[i], newCards[n]] = [newCards[n], newCards[i]];
  }

  return newCards;
}

const drawCard = (drawPile, hand) => {
  const topCard = drawPile[drawPile.length - 1];
  return {
    newDrawPile: drawPile.slice(0,-1),
    newHand: [...hand, topCard]
  };
}

const dealCards = (drawPile, discardPile, hands) => {
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];

  // Check if there are enough cards in the drawPile. If not, shuffle the
  // discardPile and add it to the bottom.
  const numToDeal = 3;
  const numCardsNeeded = numToDeal * hands.size;
  if (drawPile.length < numCardsNeeded) {
    newDrawPile = [...shuffle(newDiscardPile), ...newDrawPile];
    newDiscardPile = [];
  }

  let newHands = new Map();
  hands.forEach((hand, username) => {
    const newCards = newDrawPile.slice(-numToDeal);
    newDrawPile = newDrawPile.slice(0, -numToDeal);
    const newHand = [...hand, ...newCards];
    newHands = new Map([...newHands, [username, newHand]]);
  });

  return { newDrawPile, newDiscardPile, newHands };
}

module.exports = { initHorizonDeck, drawCard, dealCards };
