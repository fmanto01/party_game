import * as c from './socketConsts.mjs';
const socket = io();

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

document.addEventListener('DOMContentLoaded', function () {
  const createGameBtn = document.getElementById('createGameBtn');
  const playersTable = document.getElementById('playersTable');
  const numQuestionsInput = document.getElementById('numQuestions');
  const playerNameInput = document.getElementById('playerNameInput');

  createGameBtn.addEventListener('click', function () {
    // Genera un nuovo codice per la lobby
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, parseInt(numQuestionsInput.value)]);
  });

  socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
    const table = document.getElementById('lobbiesList');
    table.innerHTML = '';
    // Itera su ogni lobby
    lobbies.forEach(lobby => {
      // Crea una riga di intestazione per la lobby
      const row = document.createElement('tr');
      const codeCell = document.createElement('td');
      const playersCell = document.createElement('td');
      codeCell.textContent = `Lobby: ${lobby.lobbyCode}`;
      playersCell.textContent = lobby.players.length;
      row.appendChild(codeCell);
      row.appendChild(playersCell);
      row.onclick = () => {
        const data = {
          lobbyCode: lobby.lobbyCode,
          playerName: playerNameInput.value,
        };
        console.log(data);
        socket.emit(c.JOIN_LOBBY, data);
        window.location.href = `/lobby.html/?lobbyCode=${data.lobbyCode}&name=${data.playerName}`;
      };
      table.appendChild(row);
    });
  });

  // socket.on(c.ADD_NEW_PLAYER, function (playerName) {
  //   const row = document.createElement('tr');
  //   const cell = document.createElement('td');
  //   cell.textContent = playerName;
  //   row.appendChild(cell);
  //   playersTable.appendChild(row);
  // });

});
