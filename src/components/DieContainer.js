import React from 'react';
import DieIcon from './DieIcon';
import { DICE__PUT_BACK, DICE__SET_DIE } from '../SocketEvents';

class DieContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedValue: props.die.value || 'cube' };
  }

  putBack = () => {
    const { socket, die } = this.props;
    socket.emit(DICE__PUT_BACK, die);
  }

  roll = () => {
    const values = ['blank', 'two', 'two', 'four', 'four', 'trio'];
    const randomValue = values[Math.floor(Math.random() * values.length)];
    this.setDie(randomValue);
  }

  handleChange = (event) => {
    const selectedValue = event.target.value;
    this.setState({ selectedValue });
    this.setDie(selectedValue);
  }

  setDie = (newValue) => {
    const { socket, die } = this.props;
    socket.emit(DICE__SET_DIE, die, newValue);
  }

  render() {
    const { die } = this.props;
    const { selectedValue } = this.state;
    return (
      <div className="DieContainer container">
        <DieIcon die={die} />

        <button onClick={this.putBack} type="button">Put back</button>
        <button onClick={this.roll} type="button">Roll</button>

        <label htmlFor="DieSelector">
          Set value:
          <select
            value={selectedValue}
            onChange={this.handleChange}
            id="DieSelector"
          >
            <option value="cube" disabled> </option>
            <option value="trio">Trio</option>
            <option value="four">Four</option>
            <option value="two">Two</option>
            <option value="blank">Blank</option>
          </select>
        </label>
      </div>
    );
  }
}

export default DieContainer;
