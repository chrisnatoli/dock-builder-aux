import React from 'react';
import PropTypes from 'prop-types';
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
    const { socket } = this.props;

    socket.on(HORIZON__UPDATE_DECK, (drawPile, discardPile) => (
      this.setState({ drawPile, discardPile })
    ));

    socket.on(HORIZON__ENABLE_DEALING, (isDealingEnabled) => (
      this.setState({ isDealingEnabled })
    ));
  }

  dealCards = () => {
    const { socket } = this.props;
    socket.emit(HORIZON__DEAL_CARDS);
  }

  render() {
    const { drawPile, discardPile, isDealingEnabled } = this.state;
    const lastDiscardedCard = (
      discardPile.length !== 0 ? discardPile[discardPile.length - 1] : undefined
    );

    return (
      <div className="HorizonDeckContainer container">
        <h3>Horizon deck</h3>

        <div className="DrawPileContainer">
          <p>Draw pile</p>
          <p className="NumCards">
            {`(${drawPile.length} card${drawPile.length !== 1 ? 's' : ''})`}
          </p>
          <HorizonDeck />

          <button
            onClick={this.dealCards}
            disabled={!isDealingEnabled}
            type="button"
          >
            Deal
          </button>
        </div>

        <div className="DiscardPileContainer">
          <p>Discard pile</p>
          <p className="NumCards">
            {
              `(${discardPile.length} `
              + `card${discardPile.length !== 1 ? 's' : ''})`
            }
          </p>
          <HorizonDeck topCard={lastDiscardedCard} />
        </div>
      </div>
    );
  }
}

HorizonDeckContainer.propTypes = {
  socket: PropTypes.object,
};
HorizonDeckContainer.defaultProps = {
  socket: null,
};

export default HorizonDeckContainer;
