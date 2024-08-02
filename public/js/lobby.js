import * as c from './socketConsts.mjs';
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
  const playersTable = document.getElementById('playersTable');
  const startGameBtn = document.getElementById('startGameBtn');
  const numQuestionsInput = document.getElementById('numQuestions');

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const currentLobbyCode = params.get('lobbyCode');
  const currentPlayer = params.get('name');

  socket.emit(c.REQUEST_RENDER_LOBBY, currentLobbyCode);

  socket.on(c.RENDER_LOBBY, (game) => {
    playersTable.innerHTML = '';
    game.players.forEach(player => {
      const row = document.createElement('tr');
      const cell = document.createElement('td');
      cell.textContent = player;
      row.appendChild(cell);
      playersTable.appendChild(row);
    });
  });

  startGameBtn.addEventListener('click', function () {
    const numQuestions = parseInt(numQuestionsInput.value);
    if (numQuestions >= 5) {
      const data = { lobbyCode: currentLobbyCode, numQuestions: numQuestions };
      socket.emit(c.START_GAME, data);
    } else {
      alert('Il numero minimo di domande è 5.');
    }
  });
});
