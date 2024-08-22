import { io } from 'socket.io-client';

// const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
// const socketUrl = 'http://localhost:3001';
const socketUrl = 'http://party-game-backend.onrender.com:3001';
const socket = io(socketUrl);

export { socket };
