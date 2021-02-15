const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new Server({ server });


let arr = [...Array(10).keys()];
function shuffle(arr) {
  let copy = [...arr];
  let n = arr.length;

  while (n) {
    i = Math.floor(Math.random() * n);
    n--;

    tmp = copy[n];
    copy[n] = copy[i];
    copy[i] = tmp;
  }

  return copy;
}

wss.on('connection', (ws) => {
  console.log(`Client connected, sending ${arr}`);

  const outgoingMsg = { arr: arr };
  ws.send(JSON.stringify(outgoingMsg));

  ws.on('message', (incomingMsg) => {
    console.log('Received a message');

    arr = shuffle(arr);
    const outgoingMsg = { arr: arr };
    wss.clients.forEach((client) => client.send(JSON.stringify(outgoingMsg)));
    console.log(`Sent ${arr}`)
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});
