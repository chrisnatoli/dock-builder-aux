const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const {
  VERIFY_USERNAME,
  USER_LOGGED_IN,
  UPDATE_USER_LIST,
  USER_RECONNECTED,
  USER_DATA,
} = require('./SocketEvents');

let users = [];
let disconnectedUsers = []

io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(VERIFY_USERNAME, (username, callback) => {
    const isNameTaken = usernames().includes(username)
    callback(username, isNameTaken);
  });

  socket.on(USER_LOGGED_IN, (user) => {
    socket.user = user;
    users.push(user);
    io.emit(UPDATE_USER_LIST, usernames());
    console.log(`${user.name} logged in`)
    console.log('User list: ', usernames());
  });

  socket.on('disconnect', () => {
    users = users.filter(u => u !== socket.user);
    disconnectedUsers.push(socket.user);
    io.emit(UPDATE_USER_LIST, usernames());
    console.log(`${socket.user.name} disconnected`)
    console.log('User list: ', usernames());
  });

  socket.on(USER_RECONNECTED, (username) => {
    if (disconnectedUsers.map(u => u.name).includes(username)) {
      user = disconnectedUsers.find(u => u.name === username);
      disconnectedUsers = disconnectedUsers.filter(u => u !== user);
      users.push(user);
      socket.user = user;
      io.emit(UPDATE_USER_LIST, usernames());
      socket.emit(USER_DATA, user)
      console.log(`${user.name} reconnected`)
      console.log('User list: ', usernames());
    }
  });
});

function usernames() {
  return users.map(user => user.name);
}
