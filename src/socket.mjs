import * as c from '../public/js/socketConsts.mjs';
import { GameManager } from './data/GameManager.mjs';

const gameManager = new GameManager();
let lobbyCode = [];


// Funzione per mescolare un array
function shuffle(array) {
  if (!Array.isArray(array)) {
    console.error('shuffle: input is not an array', array);
    return [];
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function setupSocket(io, questions) {
  io.on(c.CONNECTION, (socket) => {
    socket.on(c.CREATE_LOBBY, ([code, numQuestionsParam]) => {
      console.log('Ho ricevuto questo dato: ', code, ' - ', numQuestionsParam);
      lobbyCode.push(code);
      gameManager.createGame(code, numQuestionsParam);
      gameManager.getGame(code).selectedQuestions = shuffle(questions).slice(0, numQuestionsParam);
      const lobbies = gameManager.listGames();
      console.log(lobbyCode);
      socket.emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.JOIN_LOBBY, (data) => {
      if (lobbyCode.includes(data.lobbyCode)) {
        console.log(`${data.playerName} just joined the lobby`);

        const code = data.lobbyCode;
        gameManager.getGame(code).addPlayer(data.playerName);

        socket.join(code);
      } else {
        console.log('A client tried to join a non-existing lobby');
        socket.emit(c.ERROR, 'Codice lobby non esistente');
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBIES, () => {
      const lobbies = gameManager.listGames();
      io.to(socket.id).emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.START_GAME, (data) => {
      io.to(data.lobbyCode).emit(c.INIZIA);
    });

    // socket.on(c.READY, (data) => {
    //   console.log('rejoining the lobby');
    //   socket.join(data.lobbyCode);
    //   console.log('The player is ready');
    //   const thisGame = gameManager.getGame(data.lobbyCode);
    //   const { value: question } = thisGame.getNextQuestion();
    //   const players = thisGame.players;
    //   io.to(lobbyCode).emit(c.SEND_QUESTION, { question, players });
    // });

    socket.on(c.VOTE, (data) => {
      console.log('Ho ricevuto il voto ', data);
      const thisGame = gameManager.getGame(data.lobbyCode);

      thisGame.castVote(data.voter, data.vote);

      if (thisGame.isAllPlayersVoter()) {
        const resultMessage = thisGame.calculateScores();
        const players = thisGame.players;
        io.to(data.lobbyCode).emit(c.SHOW_RESULTS, { resultMessage, players });
      }
    });

    socket.on(c.READY_FOR_NEXT_QUESTION, (data) => {
      const thisGame = gameManager.getGame(data.lobbyCode);
      thisGame.setReadyForNextQuestion(data.playerName);

      if (data.rejoin) { socket.join(data.lobbyCode); }

      if (!thisGame.isAllPlayersReady()) {
        return;
      }
      // chiedo la prossima domanda, se posso altrimento partita finita
      const { value: question, done } = thisGame.getNextQuestion();
      if (!done) {
        thisGame.resetReadyForNextQuestion(); // Reset readiness for the next round
        const players = thisGame.players;
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

    socket.on(c.REQUEST_RENDER_LOBBY, (code) => {
      const thisGame = gameManager.getGame(code);
      socket.join(code);
      io.to(code).emit(c.RENDER_LOBBY, thisGame);
    });


    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });


  });
}
