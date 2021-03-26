import React from 'react';
import PropTypes from 'prop-types';

function UsernameList(props) {
  const { usernameList } = props;
  return (
    <div className="UsernameList">
      {'Players: '}
      {
        usernameList.map((u, index) => (
          <span key={u}>
            {(index ? ', ' : '')}
            <span className={`${u === props.username ? 'ThisUsername' : ''}`}>
              {u}
            </span>
          </span>
        ))
      }
    </div>
  );
}

UsernameList.propTypes = {
  username: PropTypes.string.isRequired,
  usernameList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default UsernameList;
