const horizonCardData = require('./HorizonCardData');

const shuffle = (cards) => {
  const newCards = [...cards];
  let n = cards.length;

  while (n) {
    const i = Math.floor(Math.random() * n);
    n -= 1;
    [newCards[i], newCards[n]] = [newCards[n], newCards[i]];
  }

  return newCards;
};

const importHorizonCards = () => (
  horizonCardData.map(({ numGreen, numPurple, numOrange, numCopies }) => {
    const copies = [...Array(numCopies).keys()].map((i) => {
      const id = (
        'horizoncard_'
        + `${numGreen}g`
        + `${numPurple}p`
        + `${numOrange}o`
        + `_copy${i + 1}`
      );
      const card = Object.freeze({ id, numGreen, numPurple, numOrange });
      return card;
    });
    return copies;
  }).flat()
);

const initHorizonDeck = () => {
  let horizonDrawPile = shuffle(importHorizonCards());

  const horizonDiscardPile = horizonDrawPile.slice(-10);
  horizonDrawPile = horizonDrawPile.slice(0, -10);

  return { horizonDrawPile, horizonDiscardPile };
};

const drawCards = (drawPile, discardPile, hand, numCards) => {
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];
  if (newDrawPile.length <= numCards) {
    newDrawPile = [...shuffle(newDiscardPile), ...newDrawPile];
    newDiscardPile = [];
  }

  const topCards = newDrawPile.slice(-numCards);
  newDrawPile = newDrawPile.slice(0, -numCards);

  return {
    newDrawPile,
    newDiscardPile,
    newHand: [...hand, ...topCards],
  };
};

const dealCards = (drawPile, discardPile, hands, numToDeal) => {
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];
  let newHands = new Map();

  hands.forEach((hand, username) => {
    let newHand = [...hand];
    ({
      newDrawPile,
      newDiscardPile,
      newHand,
    } = drawCards(newDrawPile, newDiscardPile, newHand, numToDeal));
    newHands = new Map([...newHands, [username, newHand]]);
  });

  return { newDrawPile, newDiscardPile, newHands };
};

const passCards = (orderedUsernames, passedCardsDict) => {
  let newHands = new Map();

  for (let i = 0; i < orderedUsernames.length; i += 1) {
    const thisUser = orderedUsernames[i];
    const nextUserIndex = (i === orderedUsernames.length - 1) ? 0 : i + 1;
    const nextUser = orderedUsernames[nextUserIndex];

    const newHand = passedCardsDict.get(thisUser);
    newHands = new Map([...newHands, [nextUser, newHand]]);
  }

  return newHands;
};

module.exports = { initHorizonDeck, drawCards, dealCards, passCards };
