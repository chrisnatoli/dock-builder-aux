import React from 'react';
import HorizonCard from './HorizonCard';

function HorizonDeck(props) {
  const { topCard } = props;
  const blankCard = {
    numGreen: 0,
    numPurple: 0,
    numOrange: 0,
  };

  return (
    <HorizonCard card={topCard || blankCard} />
  );
}

export default HorizonDeck;
