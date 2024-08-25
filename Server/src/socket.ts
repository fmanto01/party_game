import * as c from './socketConsts.js';
import { GameManager } from './data/GameManager.js';
import { Game } from './data/Game.js';
import { AllQuestions } from './API/questions.js';

const gameManager = new GameManager();
let voteRecap: string = '';

function shuffle(array: string[]) {
  if (!Array.isArray(array)) {
    return [];
  }
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


export function setupSocket(io: any) {
  io.on(c.CONNECTION, (socket: any) => {

    console.log(`Client connected: ${socket.id}`);

    socket.on(c.DISCONNECT, () => {
      console.log('Client disconnected:', socket.id);

      for (const lobbyCode of gameManager.listLobbiesCode()) {
        const game = gameManager.getGame(lobbyCode);
        const playerName = game.players.find(pname => game.playerSocketIds[pname] === socket.id);

        if (playerName) {
          console.log(`Removing ${playerName} from lobby ${lobbyCode}`);
          game.removePlayer(playerName);
          io.to(lobbyCode).emit(c.RENDER_LOBBY, game);
          socket.leave(lobbyCode);

          // // Se la lobby è vuota, la elimino
          // if (game.players.length === 0) {
          //   console.log(`Deleting empty lobby ${lobbyCode}`);
          //   gameManager.deleteGame(lobbyCode);
          // }

          // const lobbies = gameManager.listGames();
          // io.emit(c.RENDER_LOBBIES, { lobbies });
          break;
        }
      }
    });

    socket.on(c.CREATE_LOBBY, ([code, numQuestionsParam]: [string, number]) => {
      console.log('Ho ricevuto questo dato: ', code, ' - ', numQuestionsParam);
      gameManager.createGame(code, numQuestionsParam);
      gameManager.getGame(code).selectedQuestions = shuffle(AllQuestions).slice(0, numQuestionsParam);
      const lobbies = gameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.REQUEST_TO_JOIN_LOBBY, (data: { lobbyCode: string; playerName: string, image: string }) => {
      if (gameManager.listLobbiesCode().includes(data.lobbyCode)) {
        const code = data.lobbyCode;
        console.log('sto joinando la lobby', code);
        const game = gameManager.getGame(code);

        if (game.players.includes(data.playerName)) {
          console.log(`Player with name ${data.playerName} already exists in lobby ${data.lobbyCode}`);
          socket.emit(c.PLAYER_CAN_JOIN, { canJoin: false, lobbyCode: code, playerName: data.playerName });
          return;
        }

        console.log(`${data.playerName} just joined the lobby`);
        game.addPlayer(data.playerName, socket.id, data.image);
        socket.join(code);
        socket.emit(c.PLAYER_CAN_JOIN, { canJoin: true, lobbyCode: code, playerName: data.playerName });
        io.to(code).emit(c.RENDER_LOBBY, game);
        const lobbies = gameManager.listGames();
        io.emit(c.RENDER_LOBBIES, { lobbies });
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBIES, () => {
      const lobbies = gameManager.listGames();
      socket.emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.TOGGLE_IS_READY_TO_GAME, (data: { lobbyCode: string; playerName: string }) => {
      console.log('Toggle', data.lobbyCode);
      const thisGame = gameManager.getGame(data.lobbyCode);
      thisGame.toogleIsReadyToGame(data.playerName);
      if (!thisGame.isAllPlayersReadyToGame()) {
        return;
      }
      thisGame.isGameStarted = true;
      const lobbies = gameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
      console.log(`inizio ${data.lobbyCode}`);
      io.to(data.lobbyCode).emit(c.INIZIA);
    });

    socket.on(c.VOTE, (data: { lobbyCode: string; voter: string, vote: string }) => {
      console.log('Ho ricevuto il voto ', data);
      voteRecap += `\n${data.voter} ha votato ${data.vote}`;
      const thisGame = gameManager.getGame(data.lobbyCode);

      if (thisGame.players.includes(data.vote) || data.vote === '')
        thisGame.castVote(data.voter, data.vote);

      if (thisGame.didAllPlayersVote()) {
        const resultMessage = thisGame.calculateScores();
        const players = thisGame.players;
        io.to(data.lobbyCode).emit(c.SHOW_RESULTS, { resultMessage, players, voteRecap });
        voteRecap = '';
      }
    });

    socket.on(c.READY_FOR_NEXT_QUESTION, (data: { lobbyCode: string; playerName: string }) => {
      const thisGame = gameManager.getGame(data.lobbyCode);
      thisGame.setReadyForNextQuestion(data.playerName);

      if (!thisGame.isAllPlayersReady()) {
        return;
      }
      // chiedo la prossima domanda, se posso altrimento partita finita
      const { value: question, done } = thisGame.getNextQuestion();
      if (!done) {
        thisGame.resetReadyForNextQuestion(); // Reset readiness for the next round
        const players = thisGame.players;
        io.to(data.lobbyCode).emit(c.SEND_QUESTION, { question, players });
      } else {
        console.log('Game Over: no more questions.');
        console.log('Risultati finali:');

        thisGame.players.forEach((player: string) => {
          console.log(`${player}: ${thisGame.playerScores[player]} punti`);
        });

        io.to(data.lobbyCode).emit(c.GAME_OVER, { playerScores: thisGame.playerScores, playerImages: thisGame.images });
        gameManager.deleteGame(thisGame.lobbyCode);
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBY, (lobbyCode: string, callback: (thisGame: Game) => void) => {
      const thisGame = gameManager.getGame(lobbyCode);
      if (thisGame) {
        callback(thisGame);
      }
    });

    socket.on(c.JOIN_ROOM, (data: { playerName: string, lobbyCode: string, image: string }) => {
      socket.join(data.lobbyCode);
      const thisGame = gameManager.getGame(data.lobbyCode);
      thisGame.addPlayer(data.playerName, socket.id, data.image);
    })

    socket.on(c.LEAVE_ROOM, (data: { playerName: string, lobbyCode: string }) => {
      socket.leave(data.lobbyCode);
    })

    socket.on(c.EXIT_LOBBY, (data: { currentPlayer: string; currentLobby: string; }) => {
      console.log(`Removing ${data.currentPlayer} from lobby ${data.currentLobby}`);
      const thisGame = gameManager.getGame(data.currentLobby);
      thisGame.removePlayer(data.currentPlayer);
      const lobbies = gameManager.listGames();
      console.log(thisGame.players);
      socket.leave(data.currentLobby);
      io.emit(c.RENDER_LOBBIES, { lobbies });
    });

  });
}
