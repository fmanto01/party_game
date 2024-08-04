// home.ts
import { io } from 'socket.io-client';
import * as c from '../../../server/src/socketConsts.js'; // Assicurati che il percorso sia corretto

const socket = io('http://localhost:3001');

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export function updateLobbies() {
  console.log('Updating lobbies...');
  socket.emit(c.REQUEST_RENDER_LOBBIES);
}

// 

export function handleCreateGame(numQuestions: number) {
  const code = generateLobbyCode();
  socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
}


export function listenToRenderLobbies(callback: (data: { lobbies: any[] }) => void) {
  socket.on(c.RENDER_LOBBIES, callback);
}

export function listen(navigate: Function) {
  socket.on(c.PLAYER_CAN_JOIN, (data) => {
    console.log(data);
    if (data.canJoin) {
      const queryParams = new URLSearchParams({ lobbyCode: data.lobbyCode, playerName: data.playerName });
      navigate(`/lobby?${queryParams.toString()}`);
    } else {
      alert('Sei gia in questa lobby')
    }
  });
}

export function handleJoinGame(lobbyCode: string, playerName: string) {
  if (playerName === '') {
    alert('Inserisci un nome utente');
    return;
  }
  const data = {
    lobbyCode: lobbyCode,
    playerName: playerName,
  };
  socket.emit(c.REQUEST_TO_JOIN_LOBBY, data);
}
