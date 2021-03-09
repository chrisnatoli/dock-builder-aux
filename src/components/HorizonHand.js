import React from 'react';
import HorizonCard from './HorizonCard';
import { HORIZON__DRAFTED_CARDS } from '../SocketEvents';

class HorizonHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: null,
      isSubmitted: false,
    };
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
    const { socket, hand } = this.props;
    const keptCard = hand.filter(card => card.id === cardId)[0];
    const passedCards = hand.filter(card => card.id !== cardId);
    socket.emit(HORIZON__DRAFTED_CARDS, keptCard, passedCards);
  }

  render() {
    const { hand } = this.props;
    const { selectedOption, isSubmitted } = this.state;
    const disableSubmit = isSubmitted || selectedOption === null;

    return (
      <div className="HorizonHand">
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
    );
  }
}

export default HorizonHand;
