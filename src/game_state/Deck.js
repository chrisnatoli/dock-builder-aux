const initHorizonDeck = () => {
  let nums = [...Array(10).keys()].map(i => i+1);
  let horizonDrawPile = nums.map(i => (Object.freeze({
    id: "card"+i,
    num: i,
  })));
  horizonDrawPile = shuffle(horizonDrawPile);

  nums = nums.map(i => i+10);
  const horizonDiscardPile = nums.map(i => (Object.freeze({
    id: "card"+i,
    num: i,
  })));

  return { horizonDrawPile, horizonDiscardPile };
}

const importHorizonCards = () => {
  const cardData = require('./HorizonCardsData');
  return cardData.map(({ numGreen, numPurple, numOrange, numCopies }) => {
    const copies = [...Array(numCopies).keys()].map((i) => {
      const id = (
        "horizoncard_"
        + `${numGreen}g`
        + `${numPurple}p`
        + `${numOrange}o`
        + `_copy${i+1}`
      );
      const card = Object.freeze({ id, numGreen, numPurple, numOrange });
      return card;
    });
    return copies;
  }).flat();
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
    newHand: [...hand, ...topCards]
  };
}

const dealCards = (drawPile, discardPile, hands, numToDeal) => {
  let newDrawPile = [...drawPile];
  let newDiscardPile = [...discardPile];
  let newHands = new Map();

  hands.forEach((hand, username) => {
    let newHand = [...hand];
    ({
      newDrawPile,
      newDiscardPile,
      newHand
    } = drawCards(newDrawPile, newDiscardPile, newHand, numToDeal));
    newHands = new Map([...newHands, [username, newHand]]);
  });

  return { newDrawPile, newDiscardPile, newHands };
}

const passCards = (orderedUsernames, passedCardsDict) => {
  let newHands = new Map();

  for (let i=0; i<orderedUsernames.length; i++) {
    const thisUser = orderedUsernames[i];
    const nextUserIndex = (i === orderedUsernames.length - 1) ? 0 : i+1;
    const nextUser = orderedUsernames[nextUserIndex];

    const newHand = passedCardsDict.get(thisUser);
    newHands = new Map([...newHands, [nextUser, newHand]]);
  }

  return newHands;
}



module.exports = { initHorizonDeck, drawCards, dealCards, passCards };
