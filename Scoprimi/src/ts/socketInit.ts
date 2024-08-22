import { io } from 'socket.io-client';

// const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';
// const socketUrl = 'http://localhost:3001';
const socketUrl = '44.226.145.213:3001';
const socket = io(socketUrl);

export { socket };
