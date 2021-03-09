import React from 'react';
import HorizonCard from './HorizonCard';

class HorizonHand extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedOption: null };
  }

  handleChange = (event) => {
    this.setState({ selectedOption: event.target.value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  render() {
    const { hand } = this.props;
    const { selectedOption } = this.state;

    return (
      <div className="HorizonHand">
          <form onSubmit={this.handleSubmit}>
            {hand.map(card => (
              <label>
                <input
                  type="radio"
                  value={card.id}
                  checked={selectedOption===card.id}
                  onChange={this.handleChange}
                  />

                <HorizonCard
                  card={card}
                  key={card.id}
                  checked={selectedOption===card.id}
                  />
              </label>
            ))}

            <input type="submit" value="Submit" />
          </form>
      </div>
    );
  }
}

export default HorizonHand;
