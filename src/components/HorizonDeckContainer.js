import React from 'react';
import HorizonDeck from './HorizonDeck';
import {
  HORIZON__DEAL_CARDS,
  HORIZON__UPDATE_DECK,
  HORIZON__ENABLE_DEALING,
} from '../SocketEvents';


class HorizonDeckContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPile: [],
      discardPile: [],
      isDealingEnabled: false,
    };
  }

  componentDidMount() {
    const socket = this.props.socket;

    socket.on(HORIZON__UPDATE_DECK,
       (drawPile, discardPile) => this.setState({ drawPile, discardPile })
    );

    socket.on(HORIZON__ENABLE_DEALING,
      isDealingEnabled => this.setState({ isDealingEnabled })
    );
  }

  dealCards = () => {
    this.props.socket.emit(HORIZON__DEAL_CARDS);
  }

  render() {
    const { drawPile, discardPile, isDealingEnabled } = this.state;
    const lastDiscardedCard = (
      discardPile.length!==0 ? discardPile[discardPile.length-1] : null
    );

    return (
      <div className="HorizonDeckContainer container">
        <h3>Horizon deck</h3>

        <p>Draw pile:</p>
        <p class="NumCards">
          {`(${drawPile.length} card${drawPile.length!==1 ? "s" : ""})`}
        </p>
        <HorizonDeck />

        <br/>

        <button onClick={this.dealCards} disabled={!isDealingEnabled}>
          Deal
        </button>

        <br/>

        <p>Discard pile:</p>
        <p class="NumCards">
          {`(${discardPile.length} card${discardPile.length!==1 ? "s" : ""})`}
        </p>
        <HorizonDeck topCard={lastDiscardedCard} />
      </div>
      );
  }
}

export default HorizonDeckContainer;
