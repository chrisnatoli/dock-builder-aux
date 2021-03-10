import React from 'react';
import HorizonCard from './HorizonCard';
import HorizonHand from './HorizonHand';
import {
  HORIZON__DRAW_CARD,
  HORIZON__DEAL_CARDS,
  UPDATE_HORIZON_DECK,
  UPDATE_HORIZON_HANDS,
} from '../SocketEvents';


class HorizonDeckContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawPile: [],
      discardPile: [],
      hands: new Map()
    };
    this.numToDeal = 3;
  }

  componentDidMount() {
    const socket = this.props.socket;

    socket.on(UPDATE_HORIZON_DECK,
       (drawPile, discardPile) => this.setState({ drawPile, discardPile })
    );

    socket.on(UPDATE_HORIZON_HANDS, (horizonHands) => {
      console.log(horizonHands);
      this.setState((prevState) => {
        let newHands = new Map([...prevState.hands]);

        horizonHands.forEach(([username, hand]) => {
          if (username === this.props.username) {
            newHands = new Map([...newHands, [username, hand]]);
          } else {
            // Since an opponent's hand is private information, only remember the
            // size of an opponent's hand.
            newHands = new Map([...newHands, [username, hand.length]]);
          }
        });

        return { hands: newHands };
      });
    });
  }

  drawCard = () => {
    this.props.socket.emit(HORIZON__DRAW_CARD);
  }

  dealCards = () => {
    this.props.socket.emit(HORIZON__DEAL_CARDS, this.numToDeal);
  }

  render() {
    const { username, socket } = this.props;
    const { drawPile, discardPile, hands } = this.state;

    const numCardsToDeal = this.numToDeal * hands.size;
    const enoughCards = drawPile.length + discardPile.length >= numCardsToDeal;
    const anyPlayerHasCards = [...hands.values()].some(h => h.length > 0);
    const disableDeal = anyPlayerHasCards || !enoughCards;

    return (
      <div className="HorizonDeckContainer container">
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

        <br/>

        {
          [...hands].map(([u, hand]) => (
            <div key={u}>
              {`${u}'s cards: `}
              {
                (u === username)
                ?
                <HorizonHand
                  socket={socket}
                  username={username}
                  hand={hand}
                  />
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
