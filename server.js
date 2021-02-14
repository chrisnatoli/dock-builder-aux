const express = require('express');
const { Server } = require('ws');

const PORT = process.env.PORT || 3000;
const INDEX = '/index.html';

const server = express()
  .use((req, res) => res.sendFile(INDEX, { root: __dirname }))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  ws.on('close', () => console.log('Client disconnected'));
});


let random_int = Math.floor(Math.random() * 1000);

setInterval(() => {
  wss.clients.forEach((client) => {
    time = new Date();
    if (time.getSeconds() === 0) {
      random_int = Math.floor(Math.random() * 1000)
    }

    const message = {
      time: time.toTimeString(),
      int: random_int
    };
    
    client.send(JSON.stringify(message));
  });
}, 1000);
