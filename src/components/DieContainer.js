import React from 'react';
import DieIcon from './DieIcon';

class DieContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({ selectedValue: "cube" });
  }

  putBack = () => {
  }

  roll = () => {
    const values = ["blank", "two", "two", "four", "four", "trio"];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    this.setState({ selectedValue: randomValue });
    this.setDie(randomValue);
  }

  handleChange = (event) => {
    const selectedValue = event.target.value;
    this.setState({ selectedValue });
    this.setDie(selectedValue);
  }

  setDie = (newValue) => {
  }

  render() {
    const { die } = this.props;
    return (
      <div className="DieContainer">
        <DieIcon die={die} />

        <button onClick={this.putBack}>Put back</button>
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
