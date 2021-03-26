import React from 'react';

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

export default UsernameList;
