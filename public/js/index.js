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

function updateLobbies() {
  console.log('Updating lobbies...');
  socket.emit(c.REQUEST_RENDER_LOBBIES);
}

document.addEventListener('DOMContentLoaded', function () {
  const createGameBtn = document.getElementById('createGameBtn');
  const numQuestionsInput = document.getElementById('numQuestions');
  const playerNameInput = document.getElementById('playerNameInput');

  createGameBtn.addEventListener('click', function () {
    // Genera un nuovo codice per la lobby
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, parseInt(numQuestionsInput.value)]);
  });

  setInterval(updateLobbies, 2000);

  socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
    const table = document.getElementById('lobbiesList').querySelector('tbody');
    table.innerHTML = '';
    // Itera su ogni lobby
    lobbies.forEach(lobby => {
      // Crea una riga di intestazione per la lobby
      const row = document.createElement('tr');
      const codeCell = document.createElement('td');
      const playersCell = document.createElement('td');
      const joinCell = document.createElement('td');
      
      codeCell.textContent = lobby.lobbyCode;
      playersCell.textContent = lobby.players.length;

      // Crea il pulsante Join
      const joinButton = document.createElement('button');
      joinButton.textContent = 'Join';
      joinButton.className = 'btn btn-success';
      joinButton.onclick = () => {
        if (playerNameInput.value === '') {
          alert('Inserisci un nome utente');
          return;
        }
        const data = {
          lobbyCode: lobby.lobbyCode,
          playerName: playerNameInput.value,
        };
        console.log(data);
        socket.emit(c.JOIN_LOBBY, data);

        socket.on(c.ERROR_SAME_NAME, (canJoin) => {
          alert('Giocatore già presente');
        });

        socket.on(c.PLAYER_CAN_JOIN, () => {
          window.location.href = `/lobby.html/?lobbyCode=${data.lobbyCode}&name=${data.playerName}`;
        });
      };

      joinCell.appendChild(joinButton);
      
      row.appendChild(codeCell);
      row.appendChild(playersCell);
      row.appendChild(joinCell);
      
      table.appendChild(row);
    });
  });
});