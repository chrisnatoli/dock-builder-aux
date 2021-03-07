import React from 'react';
import HorizonCard from './HorizonCard';
import { HORIZON__DRAW_CARD } from '../SocketEvents';

class HorizonDeckContainer extends React.Component {
  handleClick = () => {
    this.props.socket.emit(HORIZON__DRAW_CARD);
  }

  render() {
    const { username, deck, hands } = this.props;

    return (
      <div className="HorizonDeckContainer container">
        <p>Draw pile:</p>
        {deck.drawPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}

        <button
          onClick={this.handleClick}
          disabled={deck.drawPile.length===0}
          >
          Draw
        </button>

        <br/>

        <p>Discard pile:</p>
        {deck.discardPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}

        <br/>

        {
          [...hands].map(([u, hand]) => (
            <div class="HorizonHand" key={u}>
              {`${u}'s cards: `}
              {
                (u === username)
                ? hand.map(card => <HorizonCard card={card} key={card.id} />)
                : hand
              }
            </div>
          ))
        }
      </div>
      );
  }
}

export default HorizonDeckContainer;
