import React from 'react';
import { FaDiceD6, FaDiceFour, FaDiceThree, FaDiceTwo,
  FaSquare } from 'react-icons/fa';

class DieIcon extends React.Component {
  render() {
    let dieFace;
    switch(this.props.die.value) {
      case "blank":
        dieFace = <FaSquare />;
        break;
      case "two":
        dieFace = <FaDiceTwo />;
        break;
      case "four":
        dieFace = <FaDiceFour />;
        break;
      case "trio":
        dieFace = <FaDiceThree />;
        break;
      default:
        dieFace = <FaDiceD6 />;
    }

    return (
      <span className="Die" style={{color: this.props.die.color}}>
        {dieFace}
      </span>
    );
  }
}

export default DieIcon;
