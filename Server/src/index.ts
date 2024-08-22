import express from 'express';
import { Server, ServerOptions } from 'socket.io';
import { createServer } from 'node:https';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSocket } from './socket.js';
import { readFile } from 'node:fs/promises';

// Create an Express app
const app = express();

// Serve a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});


// Create an HTTPS server
const server = createServer(app);

// Configure Socket.IO with CORS settings
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://fmanto01.github.io'],
    methods: ['GET', 'POST'],
  },
} as Partial<ServerOptions>);

async function init() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const data = await readFile(join(__dirname, './questions.json'), 'utf8');
    const questions = JSON.parse(data);

    // Set up Socket.IO with your questions data
    setupSocket(io, questions);

    // Start the server
    server.listen(3001, () => {
      console.log('Server is running on https://localhost:3001');
    });
  } catch (err) {
    console.error('Error reading the questions file:', err);
  }
}

init();
