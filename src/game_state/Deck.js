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

const draftCards = (orderedUsernames, hands, passedCardsDict) => {
  let newHands = new Map([...hands]);

  for (let i=0; i<orderedUsernames.length; i++) {
    const thisUser = orderedUsernames[i];
    const nextUserIndex = (i === orderedUsernames.length - 1) ? 0 : i+1;
    const nextUser = orderedUsernames[nextUserIndex];

    const thisHand = newHands.get(thisUser).filter(card => (
      !passedCardsDict.get(thisUser).map(c => c.id).includes(card.id)
    ));
    const nextHand = [
      ...newHands.get(nextUser),
      ...passedCardsDict.get(thisUser)
    ];

    newHands = new Map([
      ...newHands,
      [thisUser, thisHand],
      [nextUser, nextHand]
    ]);

  }

  return newHands;
}



module.exports = { initHorizonDeck, drawCards, dealCards, draftCards };
