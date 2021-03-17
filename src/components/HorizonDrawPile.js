import React from 'react';

function HorizonDrawPile(props) {
  const { numCards } = props;
  return (
    <div className="HorizonDrawPile">
      <div className="InnerWrapper">
        <p>{`${numCards} card${numCards!==1 ? "s" : ""}`}</p>
      </div>
    </div>
  );
}

export default HorizonDrawPile;
