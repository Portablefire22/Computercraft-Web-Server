import * as http from 'http';
import { WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import express from 'express';
import World from "./world.js";
import path from 'path';
import { fileURLToPath } from 'url';
import Turtle from './turtle.js';

const ws = new WebSocketServer({
  port: 7071,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024 // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  }
});
const clients = new Map();

const hostname = '127.0.0.1';
const port = 3000;



const server = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(path.join(__dirname,'../public'));
server.use(express.static(path.join(__dirname,'../public')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../index.html'))
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

ws.on('connection', function connection(ws) {
  const id = v4();
  clients.set(ws, id);
  console.log(id);
  //ws.send(id);

  ws.on('message', function message(data) {
    console.log('received: %s', data);
    ws.send("Turtle successfully connected.");
    if (!data.toString().includes("connected") && data.toString().includes("minecraft:")) {
      World.saveWorldData(data);
    } else if (!data.toString().includes("connected") && data.toString().includes("direction")) {
      Turtle.saveTurtleData(data);
    }
  });
});



ws.on('error', console.error);
