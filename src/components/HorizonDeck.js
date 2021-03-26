import React from 'react';
import PropTypes from 'prop-types';
import HorizonCard from './HorizonCard';

function HorizonDeck(props) {
  const { topCard } = props;
  return <HorizonCard card={topCard} />;
}

HorizonDeck.propTypes = {
  topCard: PropTypes.shape({
    id: PropTypes.string,
    numGreen: PropTypes.number,
    numPurple: PropTypes.number,
    numOrange: PropTypes.number,
  }),
};
HorizonDeck.defaultProps = {
  topCard: {
    id: 'blank_horizon_card',
    numGreen: 0,
    numPurple: 0,
    numOrange: 0,
  },
};

export default HorizonDeck;
