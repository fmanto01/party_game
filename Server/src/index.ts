import express from 'express';
import { Request } from "express";
import { Server, ServerOptions } from 'socket.io';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSocket } from './socket.js';
import { readFile } from 'node:fs/promises';
import cors from 'cors';

const app = express();
app.use(cors<Request>({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://fmanto01.github.io'],
  methods: ['GET', 'POST'],
  allowedHeaders: [
    'Authorization', // Se usi l'autenticazione
    'Content-Type',  // Per le richieste POST/PUT
    'Accept',
    'Accept-Encoding',
    'Accept-Language',
    'Origin',
    'Referer',
    'User-Agent',
    'Sec-CH-UA',
    'Sec-CH-UA-Mobile',
    'Sec-CH-UA-Platform',
    'Sec-Fetch-Dest',
    'Sec-Fetch-Mode',
    'Sec-Fetch-Site'
  ],
  credentials: true,  // Se hai bisogno di inviare cookies o token di autenticazione
}));


const server = createServer(app);

app.get('/test', function (req, res) {
  res.json({ message: 'Ciao, sono nel server' });
});

const io = new Server(server);

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
