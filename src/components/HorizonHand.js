import React from 'react';
import HorizonCard from './HorizonCard';

class HorizonHand extends React.Component {
  render() {
    const { hand } = this.props;

    return (
      <div className="HorizonHand">
        {hand.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}
      </div>
    );
  }
}

export default HorizonHand;
