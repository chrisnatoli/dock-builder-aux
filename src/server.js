const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const { VERIFY_USERNAME,
  USER_LOGGED_IN,
  UPDATE_USER_LIST,
  USER_RECONNECTED,
} = require('./SocketEvents');

let usernames = [];
let disconnectedUsernames = []

io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(VERIFY_USERNAME, (username, callback) => {
    const isNameTaken = usernames.includes(username)
    callback(username, isNameTaken);
  });

  socket.on(USER_LOGGED_IN, (username) => {
    socket.username = username;
    usernames.push(username);
    io.emit(UPDATE_USER_LIST, usernames);
    console.log(`${username} logged in`)
    console.log('User list: ', usernames);
  });

  socket.on('disconnect', () => {
    usernames = usernames.filter(u => u !== socket.username);
    disconnectedUsernames.push(socket.username);
    io.emit(UPDATE_USER_LIST, usernames);
    console.log(`${socket.username} disconnected`)
    console.log('User list: ', usernames);
  });

  socket.on(USER_RECONNECTED, (username) => {
    if (disconnectedUsernames.includes(username)) {
      disconnectedUsernames = disconnectedUsernames.filter(
        u => u !== username
      );
      usernames.push(username);
      socket.username = username;
      io.emit(UPDATE_USER_LIST, usernames);
      console.log(`${username} reconnected`)
      console.log('User list: ', usernames);
    }
  });
});
