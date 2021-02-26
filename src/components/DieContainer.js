import React from 'react';
import DieIcon from './DieIcon';

class DieContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ selectedValue: "cube" });
  }

  roll = () => {
    const values = ["blank", "two", "two", "four", "four", "trio"];
    const newValue = values[Math.floor(Math.random() * values.length)];
    this.props.setDie(this.props.die, newValue);
    this.setState({ selectedValue: newValue });
  }

  handleChange = (event) => {
    const selectedValue = event.target.value;
    this.props.setDie(this.props.die, selectedValue);
    this.setState({ selectedValue });
  }

  render() {
    const { die } = this.props;
    return (
      <div className="DieContainer">
        <DieIcon die={die} />

        <button onClick={() => this.props.putBack(die)}>Put back</button>
        <button onClick={this.roll}>Roll</button>

        <label>Set value:</label>
        <select value={this.state.selectedValue} onChange={this.handleChange}>
          <option value="cube" disabled></option>
          <option value="trio">Trio</option>
          <option value="four">Four</option>
          <option value="two">Two</option>
          <option value="blank">Blank</option>
        </select>
      </div>
    );
  }
}

export default DieContainer;
