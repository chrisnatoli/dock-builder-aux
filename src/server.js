const app = require('http').createServer();
const io = require('socket.io')(app, { cors: { origin: '*' } });

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Connected to port ${PORT}`);
});

io.on('connection', (socket) => {
  console.log(`Socket ID: ${socket.id}`);
});
