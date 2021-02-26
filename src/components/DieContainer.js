import React from 'react';
import Die from './Die';

class DieContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      die: this.props.die,
    }
  }

  roll = () => {
    const values = ["blank", "two", "two", "four", "four", "trio"];
    const newValue = values[Math.floor(Math.random() * values.length)];
    this.setDieTo(newValue);
  }

  setDieTo = (value) => {
    this.setState((prevState, prevProps) => {
      const props = { ...prevState.die.props, value };
      const die = <Die { ...props } />;
      return { die };
    });
  }

  render() {
    const { die } = this.state;
    return (
      <div className="DieContainer">
        {die}
        <button onClick={this.roll}>Roll</button>
        <button onClick={() => this.props.putBack(die)}>Put back</button>
      </div>
    );
  }
}

export default DieContainer;
