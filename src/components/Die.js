import React from 'react';
import { FaDiceD6, FaDiceFour, FaDiceThree, FaDiceTwo,
  FaSquare } from 'react-icons/fa';

class Die extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: null,
    };
  }

  dieIcon = () => {
    switch(this.state.value) {
      case "blank": return <FaSquare />;
      case "two":   return <FaDiceTwo />;
      case "four":  return <FaDiceFour />;
      case "trio":  return <FaDiceThree />;
      default:      return <FaDiceD6 />;
    }
  }

  render() {
    const { dieColor } = this.props;
    return (
      <span className={`Die ${dieColor}Die`}>
        {this.dieIcon()}
      </span>
    );
  }
}

export default Die;
