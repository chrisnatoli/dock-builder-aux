import React from 'react';
import HorizonCard from './HorizonCard';
import {
  HORIZON__DRAFTED_CARDS,
  HORIZON__UPDATE_HAND,
  HORIZON__UPDATE_KEPT_CARDS,
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

    socket.on(HORIZON__UPDATE_HAND,
      hand => this.setState({ hand })
    );

    socket.on(HORIZON__UPDATE_KEPT_CARDS,
      keptCards => this.setState({ keptCards, isSubmitted: false })
    );
  }

  handleChange = (event) => {
    this.setState(prevState => {
      if (!prevState.isSubmitted) {
       return { selectedOption: event.target.value };
      }
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.setState({ isSubmitted: true });
    const cardId = this.state.selectedOption;
    const { socket } = this.props;
    const { hand } = this.state;
    const keptCard = hand.find(card => card.id === cardId);
    const passedCards = hand.filter(card => card.id !== cardId);
    socket.emit(HORIZON__DRAFTED_CARDS, keptCard, passedCards);
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
          keptCards.length > 0 &&
          <div className="KeptCardsWrapper">
            <p>Cards you kept:</p>
            {keptCards.map(card => <HorizonCard card={card} />)}
          </div>
        }

        {
          hand.length > 0 &&
          <div className="CardsToDraftWrapper">
            <p>Cards to draft:</p>

            <form onSubmit={this.handleSubmit}>
              {hand.map(card => (
                <label key={card.id}>
                  <input
                    type="radio"
                    value={card.id}
                    checked={selectedOption===card.id}
                    onChange={this.handleChange}
                    />

                  <HorizonCard
                    card={card}
                    checked={selectedOption===card.id}
                    />
                </label>
              ))}

              {
                hand.length !== 0 &&
                <input
                  type="submit"
                  value="Keep"
                  disabled={disableSubmit}
                  />
              }
            </form>
          </div>
        }

      </div>
    );
  }
}

export default HorizonHand;
