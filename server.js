#!/usr/bin/env node
const path = require('path');
const fs = require('fs');
const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const morgan = require('morgan');

const app = express();
app.use(morgan('combined'));

// Cache the page in memory, send on every http request.
const indexPage = fs.readFileSync(path.resolve('./index.html'));
app.get('*', (req, res) => {
  res.write(indexPage);
  res.end();
});

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on('connection', (ws, req) => {
  const send = msg => ws.send(JSON.stringify(msg));

  ws.on('message', msgText => {
    try {
      const msg = JSON.parse(msgText);

      console.log('<-- ', msg);

      send({id: msg.id});
    } catch (err) {
      send({type: 'error', message: err.message});
    }
  });
});

server.listen(process.env.PORT || 80);
