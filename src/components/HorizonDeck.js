import React from 'react';
import HorizonCard from './HorizonCard';
import {
  HORIZON__DEAL_CARDS,
  UPDATE_HORIZON_DECK,
} from '../SocketEvents';


class HorizonDeck extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPile: [],
      discardPile: [],
    };
    this.numToDeal = 3;
  }

  componentDidMount() {
    const socket = this.props.socket;

    socket.on(UPDATE_HORIZON_DECK,
       (drawPile, discardPile) => this.setState({ drawPile, discardPile })
    );
  }

  dealCards = () => {
    this.props.socket.emit(HORIZON__DEAL_CARDS, this.numToDeal);
  }

  render() {
    const { numPlayers } = this.props;
    const { drawPile, discardPile } = this.state;

    const numCardsToDeal = this.numToDeal * numPlayers;
    const enoughCards = drawPile.length + discardPile.length >= numCardsToDeal;
    const anyPlayerHasCards = false; // TO DO
    const disableDeal = anyPlayerHasCards || !enoughCards;

    return (
      <div className="HorizonDeck container">
        <h3>Horizon deck</h3>
        
        <p>Draw pile:</p>
        {drawPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}

        <br/>

        <button onClick={this.dealCards} disabled={disableDeal}>
          Deal
        </button>

        <br/>

        <p>Discard pile:</p>
        {discardPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}
      </div>
      );
  }
}

export default HorizonDeck;
