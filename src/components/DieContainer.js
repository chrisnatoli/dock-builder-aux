import React from 'react';
import DieIcon from './DieIcon';

class DieContainer extends React.Component {

  roll = () => {
    const values = ["blank", "two", "two", "four", "four", "trio"];
    const newValue = values[Math.floor(Math.random() * values.length)];
    this.props.setDie(this.props.die, newValue);
  }

  render() {
    const { die } = this.props;
    return (
      <div className="DieContainer">
        <DieIcon die={die} />
        <button onClick={this.roll}>Roll</button>
        <button onClick={() => this.props.putBack(die)}>Put back</button>
      </div>
    );
  }
}

export default DieContainer;
