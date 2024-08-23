import { io } from 'socket.io-client';

// const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
// const socketUrl = 'http://localhost:3001';
const socketUrl = 'https://party-game-backend.onrender.com';
// Collega il client al server Socket.IO in produzione
const socket = io(socketUrl, {
  transports: ['websocket'], // Specifica il tipo di trasporto
  withCredentials: true, // Se necessario per inviare cookies o header di autorizzazione
});


export { socket };
