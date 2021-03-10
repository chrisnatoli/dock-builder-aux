import React from 'react';
import HorizonCard from './HorizonCard';
import { HORIZON__DRAFTED_CARDS, UPDATE_HORIZON_HANDS } from '../SocketEvents';

class HorizonHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hand: [],
      selectedOption: null,
      isSubmitted: false,
    };
  }

  componentDidMount() {
    const { socket, username } = this.props;

    socket.on(UPDATE_HORIZON_HANDS, (hands) => {
      const newHand = hands.find(([u, hand]) => u === username)[1];
      this.setState({ hand: newHand });
    });
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
    const { hand, selectedOption, isSubmitted } = this.state;
    const disableSubmit = isSubmitted || selectedOption === null;

    return (
      <div className="HorizonHand container">
        <h3>Your hand of Horizon cards</h3>

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
