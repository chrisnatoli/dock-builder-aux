import React from 'react';
import { GiWoodenCrate } from 'react-icons/gi';

function HorizonCard(props) {
  const { numGreen, numPurple, numOrange } = props.card;
  return (
    <div className={`HorizonCard ${props.checked ? "highlighted" : ""}`}>
      <p>
        {[...Array(numGreen).keys()].map(i =>
          <GiWoodenCrate key={i} style={{color: "green"}} />
        )}
      </p>
      <p>
        {[...Array(numPurple).keys()].map(i =>
          <GiWoodenCrate key={i} style={{color: "purple"}} />
        )}
      </p>
      <p>
        {[...Array(numOrange).keys()].map(i =>
          <GiWoodenCrate key={i} style={{color: "orange"}} />
        )}
      </p>
    </div>
  )
}

export default HorizonCard;
