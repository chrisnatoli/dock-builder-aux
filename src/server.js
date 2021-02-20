const app = require('http').createServer();
const io = require('socket.io')(app, { cors: { origin: '*' } });
const { VERIFY_USER, USER_CONNECTED } = require('./SocketEvents');

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});

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
