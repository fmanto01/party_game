document.addEventListener('DOMContentLoaded', function () {
    const joinBtn = document.getElementById('joinBtn');
    const lobbyCodeInput = document.getElementById('lobbyCodeInput');
    const playerNameInput = document.getElementById('playerNameInput');
    const waitingMessage = document.getElementById('waitingMessage');
    const waitingText = document.getElementById('waitingText');
    let clicked = false;
    const socket = io();

    joinBtn.addEventListener('click', function () {
        if (clicked) {
            return;
        }
        clicked = true;
        const data = {
            lobbyCode: lobbyCodeInput.value,
            playerName: playerNameInput.value
        };

        if (data.lobbyCode && data.playerName) {
            console.log('Joining the lobby ', data.lobbyCode);
            waitingText.textContent = `Ciao ${data.playerName}, in attesa dell'inizio della partita...`;
            waitingMessage.style.display = 'block';
            socket.emit('joinLobby', data);
        } else {
            alert('Per favore, inserisci sia il tuo nome che un codice alfanumerico.');
        }
    });

    socket.on('startGame', function () {
        window.location.href = `/game.html/?lobbyCode=${lobbyCodeInput.value}name=${playerNameInput.value}`;
    });
});