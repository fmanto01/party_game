import { io } from 'socket.io-client';

const webServerBaseUrl = process.env.NODE_ENV === 'production'
  ? 'https://party-game-backendeu.onrender.com'
  : 'http://localhost:3001';

const socket = io(webServerBaseUrl, {
  transports: ['websocket'],
  withCredentials: true,
});


export { socket, webServerBaseUrl };
