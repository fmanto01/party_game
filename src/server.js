const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const server = createServer(app);
const io = new Server(server);

let lobbyCode;
let players = [];
let numOfPlayers = 0;
let currentQuestionIndex = 0;
let questions = [];
let numQuestions = 5; // Default value
let selectedQuestions = [];
const votes = {};
const playerScores = {}; // For tracking player scores
let readyForNextQuestion = {}; // Track readiness for next question

app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/html/index.html'));
});

app.get('/client.html', (req, res) => {
  res.sendFile(join(__dirname, '../public/html/client.html'));
});

app.get('/game.html', (req, res) => {
  res.sendFile(join(__dirname, '../public/html/game.html'));
});

// Carica le domande dal file JSON all'avvio del server
fs.readFile(path.join(__dirname, '../questions.json'), 'utf8', (err, data) => {
  if (err) {
    console.error('Errore nella lettura del file delle domande:', err);
    return;
  }
  questions = JSON.parse(data);
});

// Funzione per mescolare un array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

io.on('connection', (socket) => {
  socket.on('lobbyCode', ([code, numQuestionsParam]) => {
    console.log('Ho ricevuto questo dato: ', code, " - ", numQuestionsParam);
    lobbyCode = code;
    players = [];
    numOfPlayers = 0;
    currentQuestionIndex = 0;
    numQuestions = numQuestionsParam >= 5 ? numQuestionsParam : 5;
    Object.keys(votes).forEach(player => votes[player] = 0);
    Object.keys(playerScores).forEach(player => playerScores[player] = 0);

    // Mescola le domande e seleziona le prime numQuestions
    selectedQuestions = shuffle(questions).slice(0, numQuestions);
  });

  socket.on('joinLobby', (data) => {
    if (data.lobbyCode === lobbyCode) {
      console.log(data.playerName + ' just joined the lobby');
      players.push(data.playerName);
      votes[data.playerName] = 0;
      playerScores[data.playerName] = 0; // Initialize player scores
      readyForNextQuestion[data.playerName] = false; // Initialize readiness
      io.emit('addNewPlayer', data.playerName);
    } else {
      console.log('A client tried to join a non-existing lobby');
      socket.emit('error', 'Codice lobby non esistente');
    }
  });

  socket.on('startGame', () => {
    io.emit('startGame');
    sendQuestion();
  });

  socket.on('ready', () => {
    console.log('The player is ready');
    sendQuestion();
  });

  socket.on('vote', (data) => {
    console.log('Ho ricevuto il voto ', data);
    if (Object.prototype.hasOwnProperty.call(votes, data.vote)) {
      votes[data.vote] += 1;
    }
    numOfPlayers++;
    if (numOfPlayers === players.length) {
      numOfPlayers = 0;
      const resultMessage = calculateScores();
      io.emit('showResults', { resultMessage, players }); // Invia il risultato corrente ai client
    }
  });

  socket.on('readyForNextQuestion', (playerName) => {
    readyForNextQuestion[playerName] = true;

    if (Object.values(readyForNextQuestion).every(value => value === true)) {
      if (currentQuestionIndex + 1 < numQuestions) {
        currentQuestionIndex++;
        sendQuestion();
        resetReadyForNextQuestion(); // Reset readiness for the next round
      } else {
        io.emit('gameOver');
        console.log('Game Over: no more questions.');
        console.log('Risultati finali:');
        players.forEach(player => {
          console.log(`${player}: ${playerScores[player]} punti`);
        });
        io.emit('finalResults', playerScores); // Invia la classifica finale
      }
    }
  });

  function resetReadyForNextQuestion() {
    players.forEach(player => {
      readyForNextQuestion[player] = false;
    });
  }

  function calculateScores() {
    // Trova il giocatore con il maggior numero di voti
    const maxVotes = Math.max(...Object.values(votes));
    const winners = Object.keys(votes).filter(player => votes[player] === maxVotes);

    let resultMessage;
    if (winners.length > 1) {
      resultMessage = 'Pareggio! Nessun punto assegnato';
    } else {
      const winner = winners[0];
      playerScores[winner] += 1; // Aggiorna il punteggio del vincitore
      resultMessage = `+ 1 punto a chi ha scelto ${winner}`;
    }

    // Resetta i voti per la prossima domanda
    Object.keys(votes).forEach(player => votes[player] = 0);

    return resultMessage;
  }

  socket.on('nextQuestion', () => {
    if (currentQuestionIndex + 1 < numQuestions) {
      currentQuestionIndex++;
      sendQuestion();
    } else {
      io.emit('gameOver');
      console.log('Game Over: no more questions.');
      console.log('Risultati finali:');
      players.forEach(player => {
        console.log(`${player}: ${playerScores[player]} punti`);
      });
      io.emit('finalResults', playerScores); // Invia la classifica finale
    }
  });

  function sendQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    io.emit('sendQuestion', { question, players });
  }
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});