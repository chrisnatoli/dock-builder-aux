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
  VOTE_TO_END_GAME,
  END_GAME,
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
  HORIZON__CHOSEN_CARD,
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
let endGameVotes = [];
let horizonDrawPile, horizonDiscardPile;
let diceDict;        // username => dice array
let horizonHands;    // username => card array
let chosenCardsDict; // username => card array
let keptCardsDict;   // username => card array
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
    io.emit(UPDATE_USERNAME_LIST, usernames);
    gameLog(`${username} logged in.`);

    // In case clients were playing a game, the server resets, and then the same
    // clients reconnect with the same mid-game UI, inform them that this is a
    // new game and the UI from the old game should be wiped.
    io.emit(START_GAME, false);
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

    } else if (disconnectedUsers.includes(username)) {
      disconnectedUsers = disconnectedUsers.filter(u => u !== username);
      socket.username = username;
      sockets = new Map([...sockets, [username, socket]]);
      socket.emit(LOG_BACK_IN, username);
      sendGameState(socket);
      gameLog(`${username} reconnected.`);
    }
  });

  socket.on(START_GAME, () => {
    gameStep = ARRIVAL_PHASE_BEGINNING;
    ({ horizonDrawPile, horizonDiscardPile } = initHorizonDeck());
    diceDict        = new Map(usernames.map(u => [u, initDice(u)]));
    horizonHands    = new Map(usernames.map(u => [u, []]));
    chosenCardsDict = new Map(usernames.map(u => [u, []]));
    keptCardsDict   = new Map(usernames.map(u => [u, []]));
    passedCardsDict = new Map(usernames.map(u => [u, []]));

    usernames.forEach(u => sendGameState(sockets.get(u)));

    gameLog("The game started.");
  });

  socket.on(VOTE_TO_END_GAME, () => {
    const username = socket.username;
    if (!endGameVotes.includes(username)) {
      endGameVotes = [...endGameVotes, username];
      gameLog(`${username} voted to end the game.`);
    }

    const allUsersVoted = usernames.every(u => endGameVotes.includes(u));
    if (allUsersVoted) {
      io.emit(END_GAME);
      console.log("all users voted to end the game");
      gameStep = NOT_STARTED;
      usernames = [];
      disconnectedUsers = [];
      sockets = new Map();
      gameLogMessages = [];
      endGameVotes = [];
    }
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

    chosenCardsDict = new Map(usernames.map(u => [u, []]));
    keptCardsDict   = new Map(usernames.map(u => [u, []]));
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

  socket.on(HORIZON__DRAFTED_CARDS, (chosenCard, passedCards) => {
    // Record the user's choices and wait until all players have chosen.
    const username = socket.username;
    chosenCardsDict = new Map([...chosenCardsDict, [username, chosenCard]]);
    passedCardsDict = new Map([...passedCardsDict, [username, passedCards]]);
    gameLog(`${username} passed ${passedCards.length} `
      + `card${passedCards.length>1 ? "s" : ""}.`);

    // Once all players have chosen their cards, pass hands around the table and
    // update information accordingly.
    const everyoneReady = usernames.every(u => passedCardsDict.has(u));
    if (everyoneReady) {
      horizonHands = passCards(usernames, passedCardsDict);
      keptCardsDict = new Map([...keptCardsDict].map(
        ([u, keptCards]) => [u, [...keptCards, chosenCardsDict.get(u)] ]
      ));
      chosenCardsDict = new Map(usernames.map(u => [u, []]));

      // In the last round of drafting, add the final passed cards directly into
      // each player's array of kept cards.
      const isLastRound = horizonHands.get(username).length === 1;
      if (isLastRound) {
        usernames.forEach((username) => {
          const lastCard = horizonHands.get(username)[0];
          keptCards = [...keptCardsDict.get(username), lastCard];
          keptCardsDict = new Map([...keptCardsDict, [username, keptCards]]);
          horizonHands = new Map([ ...horizonHands, [username, []] ]);
        });
      }

      // Send information to clients.
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
  if (usernames.length === 0) { gameLogMessages = []; }
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
  const username = socket.username;

  socket.emit(START_GAME, gameStep !== NOT_STARTED);
  socket.emit(UPDATE_USERNAME_LIST, usernames);
  socket.emit(DICE__ENABLE_DRAWING, isDiceDrawingEnabled());
  socket.emit(HORIZON__ENABLE_DEALING, isDealingEnabled());

  diceDict.forEach((dice, u) => socket.emit(DICE__UPDATE, u, dice));

  socket.emit(HORIZON__UPDATE_DECK, horizonDrawPile, horizonDiscardPile);
  socket.emit(HORIZON__UPDATE_HAND, horizonHands.get(username));
  socket.emit(HORIZON__UPDATE_KEPT_CARDS, keptCardsDict.get(username));
  socket.emit(HORIZON__CHOSEN_CARD, chosenCardsDict.get(username));
}
