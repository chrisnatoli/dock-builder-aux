import React from 'react';

function UsernameList(props) {
  return (
    <div className="UsernameList">
      {"Players: "}
      {
        props.usernameList.map((u, index) => (
          <span key={u}>
            {(index ? ", " : "")}
            <span className={`${u===props.username ? "ThisUsername" : ""}`}>
              {u}
            </span>
          </span>
        ))
      }
    </div>
  )
}

export default UsernameList;
