// home.ts
import { io } from 'socket.io-client';
import * as c from '../../../server/src/socketConsts.js'; // Assicurati che il percorso sia corretto

export const socket = io();

export const generateLobbyCode = (): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

export const updateLobbies = () => {
  console.log('Updating lobbies...');
  socket.emit(c.REQUEST_RENDER_LOBBIES);
};

export const initializeSocket = (onLobbiesUpdate: (lobbies: any[]) => void) => {
  socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
    onLobbiesUpdate(lobbies);
  });
};

export const handleCreateGame = (numQuestions: number) => {
  const code = generateLobbyCode();
  socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
}
