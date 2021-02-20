const app = require('http').createServer();
const io = require('socket.io')(app, { cors: { origin: '*' } });
const { VERIFY_USER } = require('./SocketEvents');

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});

let users = [];

io.on('connection', (socket) => {
  console.log(`Socket ID: ${socket.id}`);

  socket.on(VERIFY_USER, (username) => {
    console.log(`Received VERIFY_USER request with username ${username}`);
  });
});
