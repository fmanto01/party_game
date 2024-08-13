import { io } from 'socket.io-client';
import * as c from '../../../Server/src/socketConsts.js';
const socket = io('http://localhost:3001');
import { v4 as uuidv4 } from 'uuid';

let UID = sessionStorage.getItem('UID');

if (!UID) {
  UID = uuidv4();
  sessionStorage.setItem('UID', UID);
} else {
  // console.log(UID);
  socket.emit(c.JOIN_ROOM, UID);
}


export { socket, UID };
