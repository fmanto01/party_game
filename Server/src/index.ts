import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { setupSocket } from './socket.js';
import cors from 'cors';
// API
import { setupAPI } from './API/setupAPI.js';
import { SetAllQuestions } from './API/questions.js'

const app = express();
app.use(cors());
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://fmanto01.github.io'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
setupAPI(app);
async function init() {
  try {

    // setup
    SetAllQuestions();
    setupSocket(io);

    server.listen(3001, () => {
      console.log('Server is running');
    });
  } catch (err) {
    console.error('Error reading the questions file:', err);
  }
}

init();
