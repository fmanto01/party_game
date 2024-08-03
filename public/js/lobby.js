import * as c from './socketConsts.mjs';
const socket = io();

document.addEventListener('DOMContentLoaded', function () {
  const playersTable = document.getElementById('playersTable');
  const toggleisReadyToGame = document.getElementById('toggleisReadyToGame');
  // const numQuestionsInput = document.getElementById('numQuestions'); TODO mostra e potenzialmente modifica la lobby
  const lobbyCodeTabTitle = document.getElementById('lobbyCodeTabTitle');
  const lobbyCodeTitle = document.getElementById('lobbyCodeTitle');


  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const currentLobbyCode = params.get('lobbyCode');
  const currentPlayer = params.get('name');

  lobbyCodeTitle.textContent = lobbyCodeTabTitle.textContent = currentLobbyCode;

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

  toggleisReadyToGame.addEventListener('click', () => {
    const data = {
      lobbyCode: currentLobbyCode,
      playerName: currentPlayer,
    };
    socket.emit(c.TOGGLE_IS_READY_TO_GAME, data);
  });

  socket.on('inizia', function () {
    window.location.href = `/game.html/?lobbyCode=${currentLobbyCode}&name=${currentPlayer}`;
  });
});
