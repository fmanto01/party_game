import { io } from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
// const socketUrl = 'https://party-game-backend.onrender.com';
const socket = io(socketUrl, {
  transports: ['websocket'],
  withCredentials: true,
});


export { socket };
