import React from 'react';
import { FaDiceD6, FaDiceFour, FaDiceThree, FaDiceTwo,
  FaSquare } from 'react-icons/fa';

class Die extends React.Component {
  dieIcon = () => {
    switch(this.props.value) {
      case "blank": return <FaSquare />;
      case "two":   return <FaDiceTwo />;
      case "four":  return <FaDiceFour />;
      case "trio":  return <FaDiceThree />;
      default:      return <FaDiceD6 />;
    }
  }

  render() {
    const { color } = this.props;
    return (
      <span className="Die" style={{color: color}}>
        {this.dieIcon()}
      </span>
    );
  }
}

export default Die;
