document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const lobbyCode = params.get('lobbyCode');
    const playerName = params.get('name');

    socket.emit('ready', { lobbyCode: lobbyCode });
    const timerElement = document.getElementById('timer');
    const timerContainer = document.getElementById('timerContainer');
    const questionElement = document.getElementById('question');
    const playersContainer = document.getElementById('playersContainer');
    const resultsContainer = document.getElementById('resultsContainer');
    const resultMessageContainer = document.getElementById('resultMessageContainer');
    const resultMessageElement = document.getElementById('resultMessage');
    const nextQuestionBtn = document.getElementById('nextQuestionBtn');
    const gameOverMessage = document.getElementById('gameOverMessage');
    const finalResultsContainer = document.getElementById('finalResultsContainer');
    let countdown;
    let clicked = false;

    function startTimer(duration) {
        let timeRemaining = duration;
        timerElement.textContent = timeRemaining;

        countdown = setInterval(() => {
            timeRemaining--;
            timerElement.textContent = timeRemaining;

            if (timeRemaining <= 0) {
                clearInterval(countdown);
                if (!clicked) {
                    socket.emit('vote', { lobbyCode: lobbyCode, voter: playerName, vote: '' });
                }
            }
        }, 1000);
    }

    function resetTimer() {
        clearInterval(countdown);
        timerElement.textContent = '10';
    }

    // Ricevi e mostra la domanda
    socket.on('sendQuestion', ({ question, players }) => {
        clicked = false;
        resetTimer();
        startTimer(10); // Inizia un nuovo timer di 10 secondi

        questionElement.textContent = question;
        playersContainer.innerHTML = '';

        players.forEach((player) => {
            const button = document.createElement('button');
            button.className = 'btn btn-primary m-2';
            button.textContent = player;
            button.id = player;
            button.dataset.playerName = player;

            button.addEventListener('click', () => {
                if (clicked) {
                    console.log('Hai già votato!');
                    return;
                }
                clicked = true;
                clearInterval(countdown);
                console.log(`Pulsante cliccato: ${player}`);
                console.log(playerName);
                socket.emit('vote', { lobbyCode: lobbyCode, voter: playerName, vote: player });
            });

            playersContainer.appendChild(button);
        });

        resultsContainer.style.display = 'none'; // Nascondi i risultati
        nextQuestionBtn.style.display = 'none'; // Nascondi il pulsante
        resultMessageContainer.style.display = 'none'; // Nascondi il messaggio di risultato
    });

    // Ricevi i risultati dei voti
    socket.on('showResults', ({ resultMessage, players }) => {
        console.log('Mostra risultati: ', resultMessage, " ", players);
        resultsContainer.style.display = 'block';
        resultMessageElement.textContent = resultMessage;
        resultMessageContainer.style.display = 'block'; // Mostra il messaggio di risultato
        nextQuestionBtn.style.display = 'block'; // Mostra il pulsante per il prossimo turno
    });

    // Ricevi il messaggio di risultato
    socket.on('resultMessage', (message) => {
        console.log('Mostra messaggio di risultato');
        resultMessageElement.textContent = message;
        resultMessageContainer.style.display = 'block';
    });

    // Gestisci il pulsante per passare alla domanda successiva
    nextQuestionBtn.addEventListener('click', () => {
        socket.emit('readyForNextQuestion', { lobbyCode: lobbyCode, playerName: playerName }); // Invia l'evento di prontezza al server
        nextQuestionBtn.style.display = 'none'; // Nascondi il pulsante per evitare doppio click
    });

    // Ricevi il messaggio di fine gioco
    socket.on('gameOver', () => {
        console.log('Il gioco è finito!');
        questionElement.style.display = 'none';
        playersContainer.style.display = 'none';
        resultsContainer.style.display = 'none';
        resultMessageContainer.style.display = 'none'; // Nascondi il messaggio di risultato
        timerContainer.style.display = 'none'; // Nascondi il timer
        gameOverMessage.style.display = 'block';
    });

    // Ricevi la classifica finale e mostralo come una tabella
    socket.on('finalResults', (playerScores) => {
        console.log('Risultati finali ricevuti: ', playerScores);

        timerContainer.style.display = 'none'; // Nascondi il timer

        const table = document.createElement('table');
        table.className = 'table';

        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const thPosition = document.createElement('th');
        thPosition.textContent = 'Posizione';
        const thPlayer = document.createElement('th');
        thPlayer.textContent = 'Giocatore';
        const thScore = document.createElement('th');
        thScore.textContent = 'Punti';
        headerRow.appendChild(thPosition);
        headerRow.appendChild(thPlayer);
        headerRow.appendChild(thScore);
        thead.appendChild(headerRow);
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        const sortedScores = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);
        sortedScores.forEach(([player, score], index) => {
            const row = document.createElement('tr');

            const tdPosition = document.createElement('td');
            const position = index + 1;
            let medal = '';
            if (position === 1) medal = '🥇';
            if (position === 2) medal = '🥈';
            if (position === 3) medal = '🥉';
            tdPosition.textContent = `${position} ${medal}`;

            const tdPlayer = document.createElement('td');
            tdPlayer.textContent = player;
            const tdScore = document.createElement('td');
            tdScore.textContent = score;

            row.appendChild(tdPosition);
            row.appendChild(tdPlayer);
            row.appendChild(tdScore);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        finalResultsContainer.innerHTML = ''; // Clear any previous content
        finalResultsContainer.appendChild(table);
    });
});