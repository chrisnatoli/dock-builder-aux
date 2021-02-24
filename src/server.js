const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const { VERIFY_USER,
  USER_CONNECTED,
  UPDATE_USER_LIST,
} = require('./SocketEvents');
let usernames = [];

io.on('connection', (socket) => {
  console.log(`Socket ID: ${socket.id}`);

  socket.on(VERIFY_USER, (username, callback) => {
    const isNameTaken = usernames.includes(username)
    callback(username, isNameTaken);
  });

  socket.on(USER_CONNECTED, (username) => {
    socket.username = username;
    usernames.push(username);
    io.emit(UPDATE_USER_LIST, usernames);
    console.log(usernames);
    // Currently, a single socket can register multiple names because form doesn't disappear
  });

  socket.on('disconnect', () => {
    usernames = usernames.filter(u => u !== socket.username);
    io.emit(UPDATE_USER_LIST, usernames);
    console.log(usernames);
  });
});
