import React from 'react';
import PropTypes from 'prop-types';
import {
  FaDiceD6,
  FaDiceFour, FaDiceThree, FaDiceTwo, FaSquare,
} from 'react-icons/fa';

function DieIcon(props) {
  const { die } = props;

  let dieFace;
  switch (die.value) {
    case 'blank':
      dieFace = <FaSquare />;
      break;
    case 'two':
      dieFace = <FaDiceTwo />;
      break;
    case 'four':
      dieFace = <FaDiceFour />;
      break;
    case 'trio':
      dieFace = <FaDiceThree />;
      break;
    default:
      dieFace = <FaDiceD6 />;
  }

  const { color } = die;
  const displayColor = (color === 'orange') ? 'DarkOrange' : color;

  return (
    <span className="DieIcon" style={{ color: displayColor }}>
      {dieFace}
    </span>
  );
}

DieIcon.propTypes = {
  die: PropTypes.shape({
    id: PropTypes.string,
    color: PropTypes.string,
    value: PropTypes.string,
    isOnTable: PropTypes.bool,
  }).isRequired,
};

export default DieIcon;
