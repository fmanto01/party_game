import express from 'express';
import { Server } from 'socket.io';
import { readFile } from 'node:fs';
import { createServer } from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as c from '../public/js/socketConsts.mjs';

// import { Game } from './data/Game.mjs';
import { GameManager } from './data/GameManager.mjs';

const app = express();
const server = createServer(app);
const io = new Server(server);

const gameManager = new GameManager();
let lobbyCode = [];
let questions = [];

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
readFile(join(__dirname, '../questions.json'), 'utf8', (err, data) => {
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

io.on(c.CONNECTION, (socket) => {
  socket.on(c.LOBBY_CODE, ([code, numQuestionsParam]) => {
    console.log('Ho ricevuto questo dato: ', code, ' - ', numQuestionsParam);
    lobbyCode.push(code);
    gameManager.createGame(code, numQuestionsParam);
    gameManager.getGame(code).selectedQuestions = shuffle(questions).slice(0, numQuestionsParam);
  });

  socket.on(c.JOIN_LOBBY, (data) => {
    if (lobbyCode.includes(data.lobbyCode)) {
      console.log(data.playerName + ' just joined the lobby');

      const code = data.lobbyCode;
      gameManager.getGame(code).addPlayer(data.playerName);

      socket.join(code);
      // TODO io.to non fa funzionare la tabella che fa vedere l'elenco dei giocatori
      //io.to(code).emit('addNewPlayer', data.playerName);
      io.emit(c.ADD_NEW_PLAYER, data.playerName);
    } else {
      console.log('A client tried to join a non-existing lobby');
      socket.emit(c.ERROR, 'Codice lobby non esistente');
    }
  });

  socket.on(c.START_GAME, (data) => {
    console.log(data);
    io.to(data.lobbyCode).emit(c.INIZIA);
  });

  socket.on(c.READY, (data) => {
    console.log('rejoining the lobby');
    socket.join(data.lobbyCode);
    console.log('The player is ready');
  });

  socket.on(c.VOTE, (data) => {
    console.log('Ho ricevuto il voto ', data);
    const thisGame = gameManager.getGame(data.lobbyCode);

    thisGame.castVote(data.voter, data.vote);

    if (thisGame.isAllPlayerVoter()) {
      const resultMessage = calculateScores(data.lobbyCode);
      const players = thisGame.players;
      io.to(data.lobbyCode).emit(c.SHOW_RESULTS, { resultMessage, players });
    }
  });

  socket.on(c.READY_FOR_NEXT_QUESTION, (data) => {
    const thisGame = gameManager.getGame(data.lobbyCode);
    thisGame.setReadyForNextQuestion(data.playerName);

    if (!thisGame.isAllPlayersReady()) {
      return;
    }

    // chiedo la prossima domanda, se posso altrimento partita finita
    const { value: question, done } = thisGame.getNextQuestion();
    if (!done) {
      thisGame.resetReadyForNextQuestion(); // Reset readiness for the next round
      io.to(lobbyCode).emit(c.SEND_QUESTION, { question, players });
    } else {
      console.log('Game Over: no more questions.');
      console.log('Risultati finali:');
      thisGame.players.forEach(player => {
        console.log(`${player}: ${thisGame.playerScores[player]} punti`);
      });
      io.to(data.lobbyCode).emit(c.GAME_OVER);
      io.to(data.lobbyCode).emit(c.FINAL_RESULTS, thisGame.playerScores);
    }
  });

  

});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
