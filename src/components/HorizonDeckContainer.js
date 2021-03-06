import React from 'react';

class HorizonDeckContainer extends React.Component {
  render() {
    const { deck } = this.props;
    return (
      <div className="HorizonDeckContainer container">
        <p>Draw pile:</p>
        <p>
          {deck.drawPile.map(card => card.id).join(", ")}
        </p>

        <br/>

        <p>Discard pile:</p>
        <p>
          {deck.discardPile.map(card => card.id).join(", ")}
        </p>
        </div>
      );
  }
}

export default HorizonDeckContainer;
