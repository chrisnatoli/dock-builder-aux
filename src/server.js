const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, { cors: { origin: '*' } });
const { initDice, drawDie, putBack, setDie } = require('./game_state/Dice');
const {
  initHorizonDeck,
  drawCards,
  dealCards,
  passCards,
} = require('./game_state/Deck');

const PORT = process.env.PORT || 3030;
//app.use(express.static(__dirname + '/../build')); // FOR BUILD
app.use(express.static(__dirname + '/..'));        // FOR DEVELOPMENT
server.listen(PORT, () => { console.log(`Connected to port ${PORT}`); });



const {
  CHECK_USERNAME,
  USER_LOGGED_IN,
  USER_RECONNECTED,
  START_GAME,
  DICE__DRAW_DIE,
  DICE__PUT_BACK,
  DICE__SET_DIE,
  HORIZON__DEAL_CARDS,
  HORIZON__DRAFTED_CARDS,

  LOG_BACK_IN,
  GAME_LOG_MESSAGE,
  UPDATE_USERNAME_LIST,
  DICE__ENABLE_DRAWING,
  DICE__UPDATE,
  HORIZON__UPDATE_DECK,
  HORIZON__UPDATE_HAND,
  HORIZON__UPDATE_KEPT_CARDS,
  HORIZON__ENABLE_DEALING,
} = require('./SocketEvents');

const NOT_STARTED             = "NOT_STARTED";
const ARRIVAL_PHASE_BEGINNING = "ARRIVAL_PHASE_BEGINNING"
const ARRIVAL_PHASE_DRAFTING  = "ARRIVAL_PHASE_DRAFTING"
let gameStep = NOT_STARTED;

const numToDeal = 3;

let usernames = [];
let disconnectedUsers = [];
let sockets = new Map(); // username => socket
let gameLogMessages = [];
let diceDict;  // username => dice array
let horizonDrawPile, horizonDiscardPile;
let horizonHands; // username => card array
let keptCardsDict; // username => card array
let passedCardsDict; // username => card array


io.on('connection', (socket) => {
  console.log(`New socket connected (socket ID: ${socket.id})`);

  socket.on(CHECK_USERNAME, (username, callback) => {
    const trimmedUsername = username.trim();
    let error = null;
    if (disconnectedUsers.includes(trimmedUsername)) {
      error = "USER_DISCONNECTED";
    } else if (gameStep !== NOT_STARTED) {
      error = "GAME_ALREADY_STARTED";
    } else if (usernames.includes(trimmedUsername)) {
      error = "USERNAME_TAKEN";
    } else if (trimmedUsername === "") {
      error = "USERNAME_BLANK";
    }
    callback(trimmedUsername, error);
  });

  socket.on(USER_LOGGED_IN, (username) => {
    socket.username = username;
    usernames = [...usernames, username];
    sockets = new Map([...sockets, [username, socket]]);

    /*
    const dice = initDice(username)
    diceDict = new Map([...diceDict, [username, dice]]);
    horizonHands = new Map([ ...horizonHands, [username, []] ]);
    keptCardsDict = new Map([ ...keptCardsDict, [username, []] ]);
    */

    io.emit(UPDATE_USERNAME_LIST, usernames);
    /*
    socket.broadcast.emit(DICE__UPDATE, username, dice);
    sendGameState(socket);
    */
    gameLog(`${username} logged in.`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      if (gameStep === NOT_STARTED) {
        usernames = usernames.filter(u => u !== socket.username);
      } else {
        disconnectedUsers = [...disconnectedUsers, socket.username];
      }
      io.emit(UPDATE_USERNAME_LIST, usernames);
      gameLog(`${socket.username} disconnected.`);
    }
  });

  socket.on(USER_RECONNECTED, (username) => {
    if (gameStep === NOT_STARTED) {
      socket.username = username;
      usernames = [...usernames, username];
      sockets = new Map([...sockets, [username, socket]]);

      io.emit(UPDATE_USERNAME_LIST, usernames);
      gameLog(`${username} reconnected.`);
      console.log(`${username} reconnected (before game started)`);
    } else if (disconnectedUsers.includes(username)) {
      disconnectedUsers = disconnectedUsers.filter(u => u !== username);
      socket.username = username;
      sockets = new Map([...sockets, [username, socket]]);

      socket.emit(LOG_BACK_IN, username);
      sendGameState(socket);

      gameLog(`${username} reconnected.`);
      console.log(`${username} reconnected (after game started)`);
    }
  });

  socket.on(START_GAME, () => {
    gameStep = ARRIVAL_PHASE_BEGINNING;
    ({ horizonDrawPile, horizonDiscardPile } = initHorizonDeck());
    diceDict = new Map(usernames.map(u => [u, initDice(u)]));
    horizonHands = new Map(usernames.map(u => [u, []]));
    keptCardsDict = new Map(usernames.map(u => [u, []]));

    usernames.forEach(u => sendGameState(sockets.get(u)));

    gameLog("The game started.");
  });

  socket.on('ahoy', (username) => gameLog(`${username} said, Ahoy!`));



  socket.on(DICE__DRAW_DIE, (die) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = drawDie(dice, die);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(DICE__UPDATE, username, newDice);
  });

  socket.on(DICE__PUT_BACK, (die) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = putBack(dice, die);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(DICE__UPDATE, username, newDice);
  });

  socket.on(DICE__SET_DIE, (die, newValue) => {
    const username = socket.username;
    const dice = diceDict.get(username);
    const newDice = setDie(dice, die, newValue);
    diceDict = new Map([...diceDict, [username, newDice]]);
    io.emit(DICE__UPDATE, username, newDice);
  });



  socket.on(HORIZON__DEAL_CARDS, () => {
    ({
      newDrawPile: horizonDrawPile,
      newDiscardPile: horizonDiscardPile,
      newHands: horizonHands
    }= dealCards(horizonDrawPile, horizonDiscardPile, horizonHands, numToDeal));

    keptCardsDict = new Map(usernames.map( username => [username, []] ));
    passedCardsDict = new Map();

    gameStep = ARRIVAL_PHASE_DRAFTING;
    io.emit(HORIZON__ENABLE_DEALING, isDealingEnabled());
    io.emit(HORIZON__UPDATE_DECK, horizonDrawPile, horizonDiscardPile);
    usernames.forEach((username) => {
      const hand = horizonHands.get(username);
      sockets.get(username).emit(HORIZON__UPDATE_HAND, hand);
      sockets.get(username).emit(HORIZON__UPDATE_KEPT_CARDS, []);
    });

    gameLog(`${numToDeal} Horizon cards were dealt to every player.`);
    gameLog("First round of drafting begins.");
  });

  socket.on(HORIZON__DRAFTED_CARDS, (keptCard, passedCards) => {
    const username = socket.username;
    updatedKeptCards = [...keptCardsDict.get(username), keptCard];
    keptCardsDict = new Map([...keptCardsDict, [username, updatedKeptCards]]);
    passedCardsDict = new Map([...passedCardsDict, [username, passedCards]]);

    gameLog(`${username} passed ${passedCards.length} `
      + `card${passedCards.length>1 ? "s" : ""}.`);

    const everyoneReady = usernames.every(u => passedCardsDict.has(u));
    if (everyoneReady) {
      horizonHands = passCards(usernames, passedCardsDict);

      const isLastRound = horizonHands.get(username).length === 1;
      if (isLastRound) {
        usernames.forEach((username) => {
          const lastCard = horizonHands.get(username)[0];
          updatedKeptCards = [...keptCardsDict.get(username), lastCard];
          keptCardsDict = new Map(
            [...keptCardsDict, [username, updatedKeptCards]]
          );
          horizonHands = new Map([ ...horizonHands, [username, []] ]);
        });
      }

      usernames.forEach((username) => {
        const hand = horizonHands.get(username);
        const keptCards = keptCardsDict.get(username);
        sockets.get(username).emit(HORIZON__UPDATE_HAND, hand);
        sockets.get(username).emit(HORIZON__UPDATE_KEPT_CARDS, keptCards);
      });

      if (!isLastRound) {
        gameLog("Second round of drafting begins.");
        passedCardsDict = new Map();
      } else {
        gameStep = ARRIVAL_PHASE_BEGINNING;
        io.emit(HORIZON__ENABLE_DEALING, isDealingEnabled());
        gameLog("Drafting complete.");
      }
    }
  });

});



function gameLog(message) {
  gameLogMessages = [...gameLogMessages, message];
  io.emit(GAME_LOG_MESSAGE, gameLogMessages);
}

function isDiceDrawingEnabled() {
  return gameStep !== NOT_STARTED;
}

function isDealingEnabled() {
  const numCardsToDeal = numToDeal * usernames.length;
  const cardsLeft = horizonDrawPile.length + horizonDiscardPile.length;
  const areEnoughCards = cardsLeft >= numCardsToDeal;
  return areEnoughCards && gameStep === ARRIVAL_PHASE_BEGINNING;
}

function sendGameState(socket) {
  socket.emit(START_GAME, gameStep !== NOT_STARTED);
  socket.emit(UPDATE_USERNAME_LIST, usernames);
  socket.emit(DICE__ENABLE_DRAWING, isDiceDrawingEnabled());
  socket.emit(HORIZON__ENABLE_DEALING, isDealingEnabled());

  diceDict.forEach((dice, username) => {
    socket.emit(DICE__UPDATE, username, dice);
  });

  socket.emit(HORIZON__UPDATE_DECK, horizonDrawPile, horizonDiscardPile);
  socket.emit(HORIZON__UPDATE_HAND, horizonHands.get(socket.username));
  socket.emit(HORIZON__UPDATE_KEPT_CARDS, keptCardsDict.get(socket.username));
}
