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

let users = new Map(); // username -> user object
let disconnectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(VERIFY_USERNAME, (username, callback) => {
    const isNameTaken = users.has(username)
    callback(username, isNameTaken);
  });

  socket.on(USER_LOGGED_IN, (user) => {
    socket.user = user;
    users.set(user.name, user);
    io.emit(UPDATE_USER_LIST, Array.from(users.keys()));
    console.log(`${user.name} logged in`)
    console.log('User list: ', Array.from(users.keys()));
  });

  socket.on('disconnect', () => {
    if (socket.user) {
      users.delete(socket.user.name);
      disconnectedUsers.set(socket.user.name, socket.user);
      io.emit(UPDATE_USER_LIST, Array.from(users.keys()));
      console.log(`${socket.user.name} disconnected`)
      console.log('User list: ', Array.from(users.keys()));
    }
  });

  socket.on(USER_RECONNECTED, (username) => {
    if (disconnectedUsers.has(username)) {
      user = disconnectedUsers.get(username);
      disconnectedUsers = disconnectedUsers.delete(username);
      users.set(username, user);
      socket.user = user;

      io.emit(UPDATE_USER_LIST, Array.from(users.keys()));
      socket.emit(USER_DATA, user)
      console.log(`${user.name} reconnected`)
      console.log('User list: ', Array.from(users.keys()));
    }
  });
});
