import * as c from './socketConsts.js';
import { GameManager } from './data/GameManager.js';
import { Game } from './data/Game.js';

const gameManager = new GameManager();
let lobbyCode: string[] = [];
let UIDtoLobby: { [key: string]: string } = {};


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

function removeEndGameUIDs(lobbyCode: string) {
  for (const UID in UIDtoLobby) {
    if (UIDtoLobby[UID] === lobbyCode) {
      delete UIDtoLobby[UID];
    }
  }
}

export function setupSocket(io: any, questions: string[]) {
  io.on(c.CONNECTION, (socket: any) => {
    console.log(`client connected: ${socket.id}`);

    socket.on(c.CREATE_LOBBY, ([code, numQuestionsParam]: [string, number]) => {
      console.log('Ho ricevuto questo dato: ', code, ' - ', numQuestionsParam);
      lobbyCode.push(code);
      gameManager.createGame(code, numQuestionsParam);
      gameManager.getGame(code).selectedQuestions = shuffle(questions).slice(0, numQuestionsParam);
      const lobbies = gameManager.listGames();
      io.emit(c.RENDER_LOBBIES, { lobbies });
    });

    socket.on(c.REQUEST_TO_JOIN_LOBBY, (data: { lobbyCode: string; playerName: string, uid: string }) => {
      if (lobbyCode.includes(data.lobbyCode)) {
        const code = data.lobbyCode;
        console.log('sto joinando la lobby', code);
        const game = gameManager.getGame(code);
        const uid = data.uid;

        if (game.players.includes(data.playerName)) {
          console.log(`Player with name ${data.playerName} already exists in lobby ${data.lobbyCode}`);
          socket.emit(c.PLAYER_CAN_JOIN, { canJoin: false, lobbyCode: code, playerName: data.playerName });
          return;
        }

        console.log(`${data.playerName} just joined the lobby`);
        game.addPlayer(data.playerName);
        UIDtoLobby[uid] = code;
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
      console.log('Toggle', lobbyCode);
      const thisGame = gameManager.getGame(data.lobbyCode);
      thisGame.toogleIsReadyToGame(data.playerName);
      // io.to(data.lobbyCode).emit(c.RENDER_LOBBY, thisGame);
      if (!thisGame.isAllPlayersReadyToGame()) {
        return;
      }
      console.log(`inizio ${lobbyCode}`);
      io.to(data.lobbyCode).emit(c.INIZIA);
    });

    socket.on(c.VOTE, (data: { lobbyCode: string; voter: string, vote: string }) => {
      console.log('Ho ricevuto il voto ', data);
      const thisGame = gameManager.getGame(data.lobbyCode);

      if (thisGame.players.includes(data.vote) || data.vote === '')
        thisGame.castVote(data.voter, data.vote);

      if (thisGame.didAllPlayersVote()) {
        console.log('Tutti hanno votato');
        const resultMessage = thisGame.calculateScores();
        const players = thisGame.players;
        io.to(data.lobbyCode).emit(c.SHOW_RESULTS, { resultMessage, players });
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
        io.to(lobbyCode).emit(c.SEND_QUESTION, { question, players });
      } else {
        console.log('Game Over: no more questions.');
        console.log('Risultati finali:');

        thisGame.players.forEach((player: string) => {
          console.log(`${player}: ${thisGame.playerScores[player]} punti`);
        });

        io.to(data.lobbyCode).emit(c.GAME_OVER);
        io.to(data.lobbyCode).emit(c.FINAL_RESULTS, thisGame.playerScores);
        removeEndGameUIDs(thisGame.lobbyCode);
        gameManager.deleteGame(thisGame.lobbyCode);
      }
    });

    socket.on(c.REQUEST_RENDER_LOBBY, (lobbyCode: string, callback: (thisGame: Game) => void) => {
      console.log('Received REQUEST_RENDER_LOBBY for lobbyCode:', lobbyCode);
      console.log('Received REQUEST_RENDER_LOBBY :', callback);
      const thisGame = gameManager.getGame(lobbyCode);
      if (thisGame) {
        callback(thisGame);
      }
    });

    socket.on(c.JOIN_ROOM, (uid: string) => {
      console.log(UIDtoLobby[uid]);
      socket.join(UIDtoLobby[uid]);
    })

    socket.on(c.DISCONNECT, () => {
      console.log('Client disconnected:', socket.id);
    });
  });
}
