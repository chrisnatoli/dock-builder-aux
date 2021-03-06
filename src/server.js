const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { initDice, drawDie, putBack, setDie } = require('./game_state/Dice');

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const {
  CHECK_USERNAME,
  USER_LOGGED_IN,
  USER_RECONNECTED,
  DICE__DRAW_DIE,
  DICE__PUT_BACK,
  DICE__SET_DIE,

  LOG_BACK_IN,
  GAME_LOG_MESSAGE,
  UPDATE_USERNAME_LIST,
  UPDATE_DICE,
} = require('./SocketEvents');

let usernames = [];
let disconnectedUsers = [];
let diceDict = new Map();  // username => dice array

io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(CHECK_USERNAME, (username, callback) => {
    const isUsernameTaken = usernames.includes(username);
    const isDisconnectedUser = disconnectedUsers.includes(username);
    callback(username, isUsernameTaken, isDisconnectedUser);
  });

  socket.on(USER_LOGGED_IN, (username) => {
    socket.username = username;
    usernames = [...usernames, username];
    io.emit(UPDATE_USERNAME_LIST, usernames);
    gameLog(`${username} logged in.`);

    const dice = initDice(username)
    diceDict = new Map([...diceDict, [username, dice]]);

    // Inform other users of new user
    socket.broadcast.emit(UPDATE_DICE, username, dice);

    // Inform new user of entire game state
    diceDict.forEach((d, u) => {
      socket.emit(UPDATE_DICE, u, d);
    });
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      usernames = usernames.filter(u => u !== socket.username);
      disconnectedUsers = [...disconnectedUsers, socket.username];
      io.emit(UPDATE_USERNAME_LIST, usernames);
      gameLog(`${socket.username} disconnected.`);
    }
  });

  socket.on(USER_RECONNECTED, (username) => {
    if (disconnectedUsers.includes(username)) {
      disconnectedUsers = disconnectedUsers.filter(u => u !== username);
      usernames = [...usernames, username];
      socket.username = username;

      // Send entire game state
      socket.emit(LOG_BACK_IN, username);
      diceDict.forEach((d, u) => {
        socket.emit(UPDATE_DICE, u, d);
      });

      io.emit(UPDATE_USERNAME_LIST, usernames);
      gameLog(`${username} reconnected.`);
    }
  });

  socket.on('ahoy', (username) => gameLog(`${username} says, Ahoy!`));



  socket.on(DICE__DRAW_DIE, (die) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = drawDie(dice, die);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(UPDATE_DICE, username, newDice);
  });

  socket.on(DICE__PUT_BACK, (die) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = putBack(dice, die);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(UPDATE_DICE, username, newDice);
  });

  socket.on(DICE__SET_DIE, (die, newValue) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = setDie(dice, die, newValue);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(UPDATE_DICE, username, newDice);
  });


});



function gameLog(message) {
  io.emit(GAME_LOG_MESSAGE, message);
}
