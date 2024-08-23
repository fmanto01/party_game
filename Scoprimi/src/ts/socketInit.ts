import { io } from 'socket.io-client';

const socketUrl = process.env.NODE_ENV === 'production'
  ? 'https://party-game-backend.onrender.com'
  : 'http://localhost:3001';

const socket = io(socketUrl, {
  transports: ['websocket'],
  withCredentials: true,
});


export { socket };
