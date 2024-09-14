import * as c from './socketConsts.js';
import { GameManager } from './data/GameManager.js';
import { Game } from './data/Game.js';
import { AllQuestions } from './API/questions.js';

export const actualGameManager = new GameManager();

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

// Funzione per verificare se una lobby è da eliminare
function checkLobbiesAge(io: any) {
  const lobbies = actualGameManager.listGames();
  const currentTime = Date.now();

  lobbies.forEach(lobby => {
    const game = actualGameManager.getGame(lobby.lobbyCode);
    if (game && currentTime - game.creationTime >= 60 * 60 * 1000) { // Eliminazione lobby dopo 60 minuti
      console.log(`Lobby da eliminare: ${lobby.lobbyCode}`);
      actualGameManager.deleteGame(lobby.lobbyCode);
      const lobbies = actualGameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
    }
  });
}



export function setupSocket(io: any) {
  io.on(c.CONNECTION, (socket: any) => {

    console.log(`Client connected: ${socket.id}`);
    // Avvia il controllo per l'eliminazione delle lobby (ogni 60 sec)
    setInterval(() => checkLobbiesAge(io), 10 * 1000);

    socket.on(c.DISCONNECT, () => {
      console.log('Client disconnected:', socket.id);

      for (const lobbyCode of actualGameManager.listLobbiesCode()) {
        const game = actualGameManager.getGame(lobbyCode);
        if (!game) {
          socket.emit(c.FORCE_RESET);
          return;
        }
        const playerName = game.players.find(pname => game.playerSocketIds[pname] === socket.id);

        if (playerName) {
          console.log(`Removing ${playerName} from lobby ${lobbyCode}`);
          game.removePlayer(playerName);
          io.to(lobbyCode).emit(c.RENDER_LOBBY, game);
          socket.leave(lobbyCode);

          // Se la lobby è vuota, la elimino
          if (game.players.length === 0) {
            console.log(`Deleting empty lobby ${lobbyCode}`);
            actualGameManager.deleteGame(lobbyCode);
            const lobbies = actualGameManager.listGames();
            io.emit(c.RENDER_LOBBIES, { lobbies });
            break;
          }

          // TODO fix veloce per quando un player si disconnette
          if (game.didAllPlayersVote()) {
            const players = game.players;
            const voteRecap = game.whatPlayersVoted;
            const playerImages = game.images;
            const mostVotedPerson = game.getMostVotedPerson();
            game.whatPlayersVoted = {};
            io.to(lobbyCode).emit(c.SHOW_RESULTS, { players, voteRecap, playerImages, mostVotedPerson });
          }
        }
      }
    });

    socket.on(c.TEST_LOBBY, (data: { lobbyCode: string }, callback: (arg0: boolean) => void) => {

      const game = actualGameManager.getGame(data.lobbyCode);
      if (!game && game.isGameStarted)
        callback(false);

      callback(true);
    });

    socket.on(c.CREATE_LOBBY, ([code, numQuestionsParam]: [string, number]) => {
      console.log('Creo la lobby con [codice - domande]: ', code, ' - ', numQuestionsParam);
      const newGame = actualGameManager.createGame(code, numQuestionsParam);
      actualGameManager.getGame(code).selectedQuestions = shuffle(AllQuestions).slice(0, numQuestionsParam);
      const lobbies = actualGameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
      socket.emit(c.RETURN_NEWGAME, { newGame })
    });

    socket.on(c.REQUEST_TO_JOIN_LOBBY, (data: { lobbyCode: string; playerName: string, image: string }) => {
      if (actualGameManager.listLobbiesCode().includes(data.lobbyCode)) {
        const code = data.lobbyCode;
        console.log('sto joinando la lobby', code);
        const game = actualGameManager.getGame(code);

        if (!game) {
          console.log('non esiste questa lobby');
          socket.emit(c.FORCE_RESET);
          return;
        }

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
        const lobbies = actualGameManager.listGames();
        io.emit(c.RENDER_LOBBIES, { lobbies });
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBIES, () => {
      const lobbies = actualGameManager.listGames();
      socket.emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.TOGGLE_IS_READY_TO_GAME, (data: { lobbyCode: string; playerName: string }) => {
      console.log('Toggle', data.lobbyCode);
      const thisGame = actualGameManager.getGame(data.lobbyCode);
      if (!thisGame) {
        socket.emit(c.FORCE_RESET);
        return;
      }
      thisGame.toogleIsReadyToGame(data.playerName);
      io.to(data.lobbyCode).emit(c.RENDER_LOBBY, thisGame);
      if (!thisGame.isAllPlayersReadyToGame()) {
        return;
      }
      thisGame.isGameStarted = true;
      const lobbies = actualGameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
      console.log(`Inizia partita - ${data.lobbyCode}`);
      io.to(data.lobbyCode).emit(c.INIZIA);
    });

    socket.on(c.VOTE, (data: { lobbyCode: string; voter: string, vote: string }) => {
      console.log('Ho ricevuto il voto ', data);

      const thisGame = actualGameManager.getGame(data.lobbyCode);

      if (!thisGame) {
        socket.emit(c.FORCE_RESET);
        return;
      }

      if (thisGame.players.includes(data.vote) || data.vote === '') {
        thisGame.castVote(data.voter, data.vote);
        io.to(data.lobbyCode).emit(c.PLAYERS_WHO_VOTED, { players: thisGame.whatPlayersVoted });
      }


      if (thisGame.didAllPlayersVote()) {
        const players = thisGame.players;
        const voteRecap = thisGame.whatPlayersVoted;
        const playerImages = thisGame.images;
        const mostVotedPerson = thisGame.getMostVotedPerson();
        thisGame.whatPlayersVoted = {};
        io.to(data.lobbyCode).emit(c.SHOW_RESULTS, { players, voteRecap, playerImages, mostVotedPerson });
      }
    });

    socket.on(c.READY_FOR_NEXT_QUESTION, (data: { lobbyCode: string; playerName: string }) => {
      const thisGame = actualGameManager.getGame(data.lobbyCode);
      if (!thisGame) {
        socket.emit(c.FORCE_RESET);
        return;
      }
      thisGame.setReadyForNextQuestion(data.playerName);

      if (!thisGame.isAllPlayersReady()) {
        return;
      }
      // chiedo la prossima domanda, se posso altrimento partita finita
      const { value: question, done } = thisGame.getNextQuestion();
      if (!done) {
        thisGame.resetReadyForNextQuestion(); // Reset readiness for the next round
        const players = thisGame.players;
        const images = thisGame.images;
        console.log(images);
        io.to(data.lobbyCode).emit(c.SEND_QUESTION, { question, players, images });
      } else {
        console.log('Game Over: no more questions.');
        console.log('Risultati finali:');

        thisGame.players.forEach((player: string) => {
          console.log(`${player}: ${thisGame.playerScores[player]} punti`);
        });

        io.to(data.lobbyCode).emit(c.GAME_OVER, { playerScores: thisGame.playerScores, playerImages: thisGame.images });
        actualGameManager.deleteGame(thisGame.lobbyCode);
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBY, (lobbyCode: string, callback: (thisGame: Game) => void) => {
      const thisGame = actualGameManager.getGame(lobbyCode);
      if (thisGame) {
        callback(thisGame);
      }
    });

    socket.on(c.JOIN_ROOM, (data: { playerName: string, lobbyCode: string, image: string }) => {
      socket.join(data.lobbyCode);
      const thisGame = actualGameManager.getGame(data.lobbyCode);
      if (!thisGame) {
        socket.emit(c.FORCE_RESET);
        return;
      }
      thisGame.addPlayer(data.playerName, socket.id, data.image);
    })

    socket.on(c.LEAVE_ROOM, (data: { playerName: string, lobbyCode: string }) => {
      socket.leave(data.lobbyCode);
    })

    socket.on(c.EXIT_LOBBY, (data: { currentPlayer: string; currentLobby: string; }) => {
      console.log(`Removing ${data.currentPlayer} from lobby ${data.currentLobby}`);
      const thisGame = actualGameManager.getGame(data.currentLobby);
      if (!thisGame) {
        socket.emit(c.FORCE_RESET);
        return;
      }
      thisGame.removePlayer(data.currentPlayer);
      const lobbies = actualGameManager.listGames();
      console.log(thisGame.players);
      socket.leave(data.currentLobby);
      io.emit(c.RENDER_LOBBIES, { lobbies });
      io.to(data.currentLobby).emit(c.RENDER_LOBBY, thisGame);
    });

  });
}
