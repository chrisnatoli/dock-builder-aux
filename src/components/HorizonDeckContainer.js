import React from 'react';

class HorizonDeckContainer extends React.Component {
  render() {
    const { username, deck, hands } = this.props;

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

        <br/>

        {
          [...hands].map(([u, hand]) => (
            <p key={u}>
              {`${u}'s cards: `}
              {
                (u === username)
                ? hand.map(card => card.id).join(", ")
                : hand
              }
            </p>
          ))
        }
      </div>
      );
  }
}

export default HorizonDeckContainer;
