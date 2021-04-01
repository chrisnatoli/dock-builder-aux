import React from 'react';
import PropTypes from 'prop-types';
import DiceContainer from './DiceContainer';
import HorizonDeckContainer from './HorizonDeckContainer';
import HorizonHand from './HorizonHand';

function GameInterface(props) {
  const { socket, username, opponents } = props;

  return (
    <div className="GameInterface">
      <DiceContainer
        socket={socket}
        username={username}
        isForThisUser
      />

      <div className="OpponentsDiceFlexbox">
        {opponents.map((opponentUsername) => (
          <DiceContainer
            key={username}
            socket={socket}
            username={opponentUsername}
            isForThisUser={false}
          />
        ))}
      </div>

      <div className="HorizonFlexbox">
        <HorizonDeckContainer socket={socket} />
        <HorizonHand socket={socket} />
      </div>
    </div>
  );
}

GameInterface.propTypes = {
  socket: PropTypes.object.isRequired,
  username: PropTypes.string.isRequired,
  opponents: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default GameInterface;
