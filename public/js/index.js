import * as c from './socketConsts.mjs';
const socket = io();

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const numQuestionsInput = document.getElementById('numQuestions');
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  socket.emit(c.LOBBY_CODE, [code, parseInt(numQuestionsInput.value)]);
  return code;
}

document.addEventListener('DOMContentLoaded', function () {
  const createGameBtn = document.getElementById('createGameBtn');
  const lobbyCodeElement = document.getElementById('lobbyCode');
  const playersTable = document.getElementById('playersTable');
  const startGameBtn = document.getElementById('startGameBtn');
  const numQuestionsInput = document.getElementById('numQuestions');
  let lobbyCode;
  createGameBtn.addEventListener('click', function () {
    // Svuota la tabella dei giocatori
    playersTable.innerHTML = '';

    // Genera un nuovo codice per la lobby
    lobbyCode = generateLobbyCode();
    lobbyCodeElement.textContent = 'Codice Lobby: ' + lobbyCode;
  });

  socket.on(c.ADD_NEW_PLAYER, function (playerName) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.textContent = playerName;
    row.appendChild(cell);
    playersTable.appendChild(row);
  });

  startGameBtn.addEventListener('click', function () {
    const numQuestions = parseInt(numQuestionsInput.value);
    if (numQuestions >= 5) {
      const data = { lobbyCode: lobbyCode, numQuestions: numQuestions };
      console.log('Invio dati:', data); // Aggiungi questo log
      socket.emit(c.START_GAME, data);
    } else {
      alert('Il numero minimo di domande è 5.');
    }
  });
});
