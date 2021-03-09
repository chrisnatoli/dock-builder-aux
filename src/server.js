const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { initDice, drawDie, putBack, setDie } = require('./game_state/Dice');
const {
  initHorizonDeck,
  drawCards,
  dealCards,
  draftCards
} = require('./game_state/Deck');

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
  HORIZON__DRAW_CARD,
  HORIZON__DEAL_CARDS,
  HORIZON__DRAFTED_CARDS,

  LOG_BACK_IN,
  GAME_LOG_MESSAGE,
  UPDATE_USERNAME_LIST,
  UPDATE_DICE,
  UPDATE_HORIZON_DECK,
  UPDATE_HORIZON_HAND,
} = require('./SocketEvents');


let gameLogMessages = [];
let usernames = [];
let disconnectedUsers = [];
let diceDict = new Map();  // username => dice array
let { horizonDrawPile, horizonDiscardPile } = initHorizonDeck();
let horizonHands = new Map(); // username => card array
let keptCardsDict = new Map(); // username => card array
let passedCardsDict = new Map(); // username => card array


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
    const emptyHand = []
    horizonHands = new Map([...horizonHands, [username, emptyHand]]);

    // Inform other users of new user and inform new user of entire game state
    socket.broadcast.emit(UPDATE_DICE, username, dice);
    socket.broadcast.emit(UPDATE_HORIZON_HAND, username, emptyHand);
    sendGameState(socket);
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
      sendGameState(socket);

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



  socket.on(HORIZON__DRAW_CARD, () => {
    const username = socket.username;
    const hand = horizonHands.get(username);

    let newHand;
    ({
      newDrawPile: horizonDrawPile,
      newDiscardPile: horizonDiscardPile,
      newHand: newHand
    } = drawCards(horizonDrawPile, horizonDiscardPile, hand, 1));
    horizonHands = new Map([...horizonHands, [username, newHand]]);

    io.emit(UPDATE_HORIZON_DECK, horizonDrawPile, horizonDiscardPile);
    io.emit(UPDATE_HORIZON_HAND, username, newHand);
  });

  socket.on(HORIZON__DEAL_CARDS, (numToDeal) => {
    ({
      newDrawPile: horizonDrawPile,
      newDiscardPile: horizonDiscardPile,
      newHands: horizonHands
    }= dealCards(horizonDrawPile, horizonDiscardPile, horizonHands, numToDeal));

    keptCardsDict = new Map();
    passedCardsDict = new Map();

    io.emit(UPDATE_HORIZON_DECK, horizonDrawPile, horizonDiscardPile);
    horizonHands.forEach((hand, username) => {
      io.emit(UPDATE_HORIZON_HAND, username, hand);
    });
  });

  socket.on(HORIZON__DRAFTED_CARDS, (keptCard, passedCards) => {
    const username = socket.username;
    keptCardsDict = new Map([...keptCardsDict, [username, keptCard]]);
    passedCardsDict = new Map([...passedCardsDict, [username, passedCards]]);

    console.log(`${username} kept ${keptCard.id} and passed ${passedCards.map(c => c.id).join(", ")}`);

    const everyoneReady = usernames.every(u => passedCardsDict.has(u));
    if (everyoneReady) {
      console.log(horizonHands);
      horizonHands = draftCards(usernames, horizonHands, passedCardsDict);
      console.log(horizonHands);
      horizonHands.forEach((hand, username) => {
        io.emit(UPDATE_HORIZON_HAND, username, hand);
      });
    }
  });

});



function gameLog(message) {
  gameLogMessages = [...gameLogMessages, message];
  io.emit(GAME_LOG_MESSAGE, gameLogMessages);
}

function sendGameState(socket) {
  diceDict.forEach((dice, username) => {
    socket.emit(UPDATE_DICE, username, dice);
  });

  socket.emit(UPDATE_HORIZON_DECK, horizonDrawPile, horizonDiscardPile);

  horizonHands.forEach((hand, username) => {
    socket.emit(UPDATE_HORIZON_HAND, username, hand);
  });
}
