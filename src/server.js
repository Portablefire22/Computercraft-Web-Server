import * as http from 'http';
import { WebSocketServer } from 'ws';
import { v4 } from 'uuid';
import express from 'express';
import World from "./world.js";
import path from 'path';
import { fileURLToPath } from 'url';
import Turtle from './turtle.js';
import fileStorage from './fileStorage.js';

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

var client = null; // This refreshes the page


const server = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(path.join(__dirname,'../public'));
server.use(express.static(path.join(__dirname,'../public')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../index.html'))
});

server.get('/storage', (req,res) => {
  res.sendFile(path.join(__dirname,'../public/storage.html'))
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

server.get('/subscribe', (req, res) => {
  // send headers to keep connection alive
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  // send client a simple response
  res.write('you are subscribed\n\n');

  // store `res` of client to let us send events at will
  client = res;

  // listen for client 'close' requests
  req.on('close', () => { client = null; });
});

function sendRefresh() {
  client.write('data: refresh\n\n');
}


ws.on('connection', function connection(ws) {

    const id = v4();
    clients.set(ws, id);
  /* 
  MESSAGE FORMAT
  GENERAL:
    ${TURTLE_LABEL}:${TYPE}:${DATA}
  */
    ws.on('message', async function message(data) {
        var splitData = data.toString();
        console.log(splitData);
        splitData = splitData.split(".");
        console.log(splitData);
        try {
            switch (splitData[1].toString().toUpperCase() ){
                case "BLOCK":
                    World.saveWorldData(splitData[2]);
                    break;
                case "POSITION":
                    if (splitData[2].toString().toUpperCase() == "GET"){
                        var posData = await Turtle.getTurtleData(splitData[0]);
                        ws.send(`${posData}`);
                    } else if (splitData[2].toString().toUpperCase() == "POST") {
                        Turtle.saveTurtleData(splitData[3],splitData[0]);
                    }
                    break;
                case "STORAGE":
                    if (splitData.length >= 3) {
                        fileStorage.commandHandler(splitData[2], [splitData[3], splitData[4]]);
                    }
                    sendRefresh();
                    break;
                case "CONNECTION":
                    turtles.push([splitData[0],id]);
                    ws.send(`Turtle '${splitData[0]}' added.`);
                    console.log(turtles);
                    break;
                default:
                console.log(`MESSAGE TYPE ${splitData[1]} NOT FOUND!`);
                break;
            }
        }
        catch (error) {
            console.log(`"${splitData}" caused an error`);
            console.error(error);
        }
    });
});

var turtles = []
ws.on('error', console.error);
