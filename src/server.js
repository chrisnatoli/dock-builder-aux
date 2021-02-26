const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const {
  CHECK_USERNAME,
  USER_LOGGED_IN,
  UPDATE_USERNAME_LIST,
  USER_RECONNECTED,
  USER_DATA,
  GAME_LOG_MESSAGE,
} = require('./SocketEvents');

let users = new Map(); // username -> user object
let disconnectedUsers = new Map();

io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(CHECK_USERNAME, (name, callback) => {
    const isNameTaken = users.has(name);
    const isDisconnectedUser = disconnectedUsers.has(name);
    callback(name, isNameTaken, isDisconnectedUser);
  });

  socket.on(USER_LOGGED_IN, (user) => {
    socket.user = user;
    users.set(user.name, user);
    io.emit(UPDATE_USERNAME_LIST, Array.from(users.keys()));
    console.log(`${user.name} logged in`);
    console.log('User list: ', Array.from(users.keys()));
    gameLog(`${user.name} logged in.`);
  });

  socket.on('disconnect', () => {
    if (socket.user) {
      users.delete(socket.user.name);
      disconnectedUsers.set(socket.user.name, socket.user);
      io.emit(UPDATE_USERNAME_LIST, Array.from(users.keys()));
      console.log(`${socket.user.name} disconnected`);
      console.log('User list: ', Array.from(users.keys()));
      gameLog(`${socket.user.name} disconnected.`);
    }
  });

  socket.on(USER_RECONNECTED, (name) => {
    if (disconnectedUsers.has(name)) {
      user = disconnectedUsers.get(name);
      disconnectedUsers.delete(name);
      users.set(name, user);
      socket.user = user;

      socket.emit(USER_DATA, user);
      io.emit(UPDATE_USERNAME_LIST, Array.from(users.keys()));
      console.log(`${user.name} reconnected`);
      console.log('User list: ', Array.from(users.keys()));
      gameLog(`${user.name} reconnected.`);
    }
  });

  socket.on('ahoy', (name) => gameLog(`${name} says, Ahoy!`));
});

function gameLog(message) {
  io.emit(GAME_LOG_MESSAGE, message);
}
