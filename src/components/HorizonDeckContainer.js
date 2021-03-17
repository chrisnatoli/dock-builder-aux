import React from 'react';
import HorizonCard from './HorizonCard';
import HorizonDrawPile from './HorizonDrawPile';
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

    return (
      <div className="HorizonDeckContainer container">
        <h3>Horizon deck</h3>

        <p>Draw pile:</p>
        <HorizonDrawPile numCards={drawPile.length} />

        <br/>

        <button onClick={this.dealCards} disabled={!isDealingEnabled}>
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

export default HorizonDeckContainer;
