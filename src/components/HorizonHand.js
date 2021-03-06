import React from 'react';
import PropTypes from 'prop-types';
import HorizonCard from './HorizonCard';
import {
  HORIZON__DRAFTED_CARDS,
  HORIZON__UPDATE_HAND,
  HORIZON__UPDATE_KEPT_CARDS,
  HORIZON__CHOSEN_CARD,
} from '../SocketEvents';

class HorizonHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hand: [],
      keptCards: [],
      selectedOption: null,
      isSubmitted: false,
    };
  }

  componentDidMount() {
    const { socket } = this.props;

    socket.on(HORIZON__UPDATE_HAND, (hand) => (
      this.setState({ hand, selectedOption: null })
    ));

    socket.on(HORIZON__UPDATE_KEPT_CARDS, (keptCards) => (
      this.setState({ keptCards, isSubmitted: false })
    ));

    // This is only needed in case a user disconnects and reconnects in the
    // middle of a round of drafting.
    socket.on(HORIZON__CHOSEN_CARD, (chosenCard) => {
      if (chosenCard) {
        this.setState({ selectedOption: chosenCard.id, isSubmitted: true });
      }
    });
  }

  handleChange = (event) => {
    this.setState((prevState) => {
      if (!prevState.isSubmitted) {
        return { selectedOption: event.target.value };
      }
      return prevState;
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitted: true });
    const { selectedOption, hand } = this.state;
    const { socket } = this.props;
    const cardId = selectedOption;
    const chosenCard = hand.find((card) => card.id === cardId);
    const passedCards = hand.filter((card) => card.id !== cardId);
    socket.emit(HORIZON__DRAFTED_CARDS, chosenCard, passedCards);
  }

  render() {
    const { hand, keptCards, selectedOption, isSubmitted } = this.state;
    const disableSubmit = isSubmitted || selectedOption === null;

    if (keptCards.length === 0 && hand.length === 0) {
      return null;
    }

    return (
      <div className="HorizonHand container">
        <h3>Your hand of Horizon cards</h3>

        {
          keptCards.length > 0 && (
            <div className="KeptCardsContainer">
              <p>Cards you kept</p>
              {
                keptCards.map((card) => (
                  <HorizonCard card={card} key={card.id} />
                ))
              }
            </div>
          )
        }

        {
          hand.length > 0 && (
            <div className="CardsToDraftContainer">
              <p>Cards to draft</p>

              <form onSubmit={this.handleSubmit}>
                {hand.map((card) => (
                  <label key={card.id} htmlFor={`radio_${card.id}`}>
                    <input
                      id={`radio_${card.id}`}
                      type="radio"
                      value={card.id}
                      checked={selectedOption === card.id}
                      onChange={this.handleChange}
                    />

                    <HorizonCard
                      card={card}
                      checked={selectedOption === card.id}
                    />
                  </label>
                ))}

                <input type="submit" value="Choose" disabled={disableSubmit} />
              </form>

              {
                isSubmitted
                && <p>(Waiting for other players to choose.)</p>
              }
            </div>
          )
        }

      </div>
    );
  }
}

HorizonHand.propTypes = {
  socket: PropTypes.object,
};
HorizonHand.defaultProps = {
  socket: null,
};

export default HorizonHand;
