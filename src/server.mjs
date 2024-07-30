import express from 'express';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';
import { readFile } from 'node:fs';
import { join as _join } from 'node:path';
import { fileURLToPath } from 'node:url';


const app = express();
const server = createServer(app);
const io = new Server(server);

let lobbyCode = [];
// let players = [];
// let numOfPlayers = 0;
// let currentQuestionIndex = 0;
let questions = [];
// let numQuestions = 5; // Default value
// let selectedQuestions = [];
// const votes = {};
// const playerScores = {}; // For tracking player scores
// let readyForNextQuestion = {}; // Track readiness for next question

import { GameManager } from './data/GameManager.mjs';  // Correct path
import { Game } from './data/Game.mjs';
const gameManager = new GameManager();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
readFile(_join(__dirname, '../questions.json'), 'utf8', (err, data) => {
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
    lobbyCode.push(code);
    gameManager.games[code] = new Game(code, numQuestionsParam);
    // Mescola le domande e seleziona le prime numQuestions
    // TODO FIX sempre parametro (def 5)
    gameManager.games[code].selectedQuestions = shuffle(questions).slice(0, numQuestionsParam)
  });

  socket.on('joinLobby', (data) => {
    if (lobbyCode.includes(data.lobbyCode)) {
      console.log(data.playerName + ' just joined the lobby');

      const code = data.lobbyCode;
      gameManager.games[code].players.push(data.playerName);
      gameManager.games[code].votes[data.playerName] = 0;
      gameManager.games[code].playerScores[data.playerName] = 0; // Initialize player scores
      gameManager.games[code].readyForNextQuestion[data.playerName] = false; // Initialize readiness

      io.emit('addNewPlayer', data.playerName);
    } else {
      console.log('A client tried to join a non-existing lobby');
      socket.emit('error', 'Codice lobby non esistente');
    }
  });

  socket.on('startGame', (data) => {
    console.log(data);
    io.emit('inizia');
    sendQuestion(data.lobbyCode);
  });

  socket.on('ready', (data) => {
    console.log('The player is ready');
    sendQuestion(data.lobbyCode);
  });

  socket.on('vote', (data) => {
    console.log('Ho ricevuto il voto ', data);
    const thisGame = gameManager.games[data.lobbyCodecode];
    if (Object.prototype.hasOwnProperty.call(thisGame.votes, data.vote)) {
      thisGame.votes[data.vote] += 1;
    }
    thisGame.numOfPlayers++;
    if (thisGame.numOfPlayers === thisGame.players.length) {
      thisGame.numOfPlayers = 0;
      const resultMessage = calculateScores(data.lobbyCodecode);
      const p = thisGame.players;
      io.emit('showResults', { resultMessage, p }); // Invia il risultato corrente ai client
    }
  });

  socket.on('readyForNextQuestion', (data) => {
    const thisGame = gameManager.games[data.lobbyCode];
    thisGame.readyForNextQuestion[data.playerName] = true;

    if (Object.values(thisGame.readyForNextQuestion).every(value => value === true)) {
      if (thisGame.currentQuestionIndex + 1 < thisGame.numQuestions) {
        thisGame.currentQuestionIndex++;
        sendQuestion(data.lobbyCode);
        resetReadyForNextQuestion(data.lobbyCode); // Reset readiness for the next round
      } else {
        io.emit('gameOver');
        console.log('Game Over: no more questions.');
        console.log('Risultati finali:');
        thisGame.players.forEach(player => {
          console.log(`${player}: ${thisGame.playerScores[player]} punti`);
        });
        io.emit('finalResults', thisGame.playerScores); // Invia la classifica finale
      }
    }
  });

  function resetReadyForNextQuestion(lobbyCode) {
    const thisGame = gameManager.games[lobbyCode];
    thisGame.players.forEach(player => {
      thisGame.readyForNextQuestion[player] = false;
    });
  }

  function calculateScores(lobbyCode) {
    const thisGame = gameManager.games[lobbyCode];
    // Trova il giocatore con il maggior numero di voti
    const maxVotes = Math.max(...Object.values(thisGame.votes));
    const winners = Object.keys(thisGame.votes).filter(player => thisGame.votes[player] === maxVotes);

    let resultMessage;
    if (winners.length > 1) {
      resultMessage = 'Pareggio! Nessun punto assegnato';
    } else {
      const winner = winners[0];
      thisGame.playerScores[winner] += 1; // Aggiorna il punteggio del vincitore
      resultMessage = `+ 1 punto a chi ha scelto ${winner}`;
    }

    // Resetta i voti per la prossima domanda
    Object.keys(thisGame.votes).forEach(player => thisGame.votes[player] = 0);

    return resultMessage;
  }

  socket.on('nextQuestion', (lobbyCode) => {
    const thisGame = gameManager.games[lobbyCode];
    if (thisGame.currentQuestionIndex + 1 < thisGame.numQuestions) {
      thisGame.currentQuestionIndex++;
      sendQuestion(lobbyCode);
    } else {
      io.emit('gameOver');
      console.log('Game Over: no more questions.');
      console.log('Risultati finali:');
      thisGame.players.forEach(player => {
        console.log(`${player}: ${thisGame.playerScores[player]} punti`);
      });
      io.emit('finalResults', thisGame.playerScores); // Invia la classifica finale
    }
  });

  function sendQuestion(lobbyCode) {

    const thisGame = gameManager.games[lobbyCode];

    console.log("######");
    console.log(lobbyCode);
    console.log(thisGame);
    console.log("######");

    const question = thisGame.selectedQuestions[thisGame.currentQuestionIndex];
    const p = thisGame.players;
    io.emit('sendQuestion', { question, p });
  }
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});