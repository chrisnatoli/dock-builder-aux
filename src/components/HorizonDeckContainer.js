import React from 'react';
import HorizonCard from './HorizonCard';
import {
  HORIZON__DRAW_CARD,
  HORIZON__DEAL_CARDS,
  UPDATE_HORIZON_DECK,
  UPDATE_HORIZON_HAND,
} from '../SocketEvents';


class HorizonDeckContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPile: [],
      discardPile: [],
      hands: new Map()
    };
  }

  componentDidMount() {
    const socket = this.props.socket;

    socket.on(UPDATE_HORIZON_DECK,
       (drawPile, discardPile) => this.setState({ drawPile, discardPile })
    );

    socket.on(UPDATE_HORIZON_HAND, (username, hand) => {
      this.setState((prevState) => {
        const oldHands = prevState.hands;
        let newHands;

        if (username === this.props.username) {
          newHands = new Map([...oldHands, [username, hand]]);
        } else {
          // Since an opponent's hand is private information, only remember the
          // size of an opponent's hand.
          newHands = new Map([...oldHands, [username, hand.length]]);
        }

        return { hands: newHands };
      });
    });
  }

  drawCard = () => {
    this.props.socket.emit(HORIZON__DRAW_CARD);
  }

  dealCards = () => {
    this.props.socket.emit(HORIZON__DEAL_CARDS);
  }

  render() {
    const { username } = this.props;
    const { drawPile, discardPile, hands } = this.state;

    return (
      <div className="HorizonDeckContainer container">
        <p>Draw pile:</p>
        {drawPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}

        <br/>

        <button
          onClick={this.drawCard}
          disabled={drawPile.length === 0}
          >
          Draw
        </button>

        <button
          onClick={this.dealCards}
          disabled={drawPile.length===0}
          >
          Deal
        </button>

        <br/>

        <p>Discard pile:</p>
        {discardPile.map(card => (
          <HorizonCard card={card} key={card.id} />
        ))}

        <br/>

        {
          [...hands].map(([u, hand]) => (
            <div className="HorizonHand" key={u}>
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
