import express from 'express';
import { Request } from "express";
import { Server, ServerOptions } from 'socket.io';
import { createServer } from 'node:https';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSocket } from './socket.js';
import { readFile } from 'node:fs/promises';
import cors from 'cors';

const app = express();
app.use(cors<Request>());

app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// CORS settings for Express
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://fmanto01.github.io'); // Allow your specific origin
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://fmanto01.github.io/'],

    methods: ['GET', 'POST'],
  },
} as Partial<ServerOptions>);

async function init() {
  try {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const data = await readFile(join(__dirname, './questions.json'), 'utf8');
    const questions = JSON.parse(data);

    // setup
    setupSocket(io, questions);

    server.listen(3001, () => {
      console.log('Server is running on http://localhost:3001');
    });
  } catch (err) {
    console.error('Error reading the questions file:', err);
  }
}

init();
