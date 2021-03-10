import React from 'react';

function HorizonCard(props) {
  return (
    <div className={`HorizonCard ${props.checked ? "highlighted" : ""}`}>
      <div className="InsideCard">
        <p>{props.card.num}</p>
      </div>
    </div>
  )
}

export default HorizonCard;
