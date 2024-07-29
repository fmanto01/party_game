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

app.use(express.static(join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

app.get('/client.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'client.html'));
});

app.get('/game.html', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'game.html'));
});

// Carica le domande dal file JSON all'avvio del server
fs.readFile(path.join(__dirname, 'questions.json'), 'utf8', (err, data) => {
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
    if (votes.hasOwnProperty(data.vote)) {
      votes[data.vote] += 1;
    } else {
      console.log(`Player ${data.vote} not found`);
    }

    numOfPlayers++;
    if (numOfPlayers === players.length) {
      numOfPlayers = 0;
      calculateScores();
      io.emit('showResults', { votes, players }); // Invia i risultati ai client
    }
  });

  function calculateScores() {
    // Trova il giocatore con il maggior numero di voti
    const maxVotes = Math.max(...Object.values(votes));
    const winners = Object.keys(votes).filter(player => votes[player] === maxVotes);

    // Aggiorna i punteggi dei vincitori
    winners.forEach(winner => playerScores[winner] += 1);

    // Crea un messaggio di risultato
    const resultMessage = winners.length > 1 ? 'Pareggio!' : `+ 1 punto a chi ha scelto ${winners[0]}`;
    
    // Invia il messaggio di risultato ai client
    io.emit('resultMessage', resultMessage);
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