const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
app.use(express.static(__dirname + '/../build')); // FOR BUILD
//app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const { VERIFY_USER, USER_CONNECTED } = require('./SocketEvents');
let users = [];

io.on('connection', (socket) => {
  console.log(`Socket ID: ${socket.id}`);

  socket.on(VERIFY_USER, (username, callback) => {
    const isNameTaken = users.map(u => u.username).includes(username)
    callback(username, isNameTaken);
  });

  socket.on(USER_CONNECTED, (username) => {
    users.push({ socket, username });
    // Currently, a single socket can register multiple names because form doesn't disappear
  });
});
