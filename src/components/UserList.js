import React from 'react';
import { UPDATE_USER_LIST } from '../SocketEvents';

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: []
    }
  }

  componentDidMount() {
    const { socket } = this.props;
    if (socket) {
      socket.on(UPDATE_USER_LIST, (userList) => {
        this.setState({ userList });
      });
    }
  }

  render() {
    const { userList } = this.state;
    return (
      <div>Players: {userList.join(', ')}</div>
    );
  }
}

export default UserList;
