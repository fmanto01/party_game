import express from 'express';
import { Server } from 'socket.io';
import { createServer, get } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSocket } from './socket.mjs';
import { readFile } from 'node:fs/promises';
import cors from 'cors';

const app = express();
app.use(cors());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  },
});


async function init() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const data = await readFile(join(__dirname, './questions.json'), 'utf8');
    const questions = JSON.parse(data);

    // setup
    setupSocket(io, questions);

    server.listen(3001, () => {
      console.log('Server is running on http://localhost:3000');
    });
  } catch (err) {
    console.error('Errore nella lettura del file delle domande:', err);
  }
}

init();
