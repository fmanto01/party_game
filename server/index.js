import express from 'express';
import { Server } from 'socket.io';
import { createServer, get } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setupSocket } from './socket.mjs';

import cors from 'cors';

const app = express();
app.use(cors())
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
  }
});

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// app.use(express.static(join(__dirname, '../public')));


setupSocket(io, ['q1', 'q2']);

server.listen(3001, () => {
  console.log('Server is running on http://localhost:3000')
})