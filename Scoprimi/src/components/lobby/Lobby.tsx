import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts.js';
import { socket } from '../../ts/socketInit.ts';
import { useSession } from '../../contexts/SessionContext.tsx';

interface Game {
  lobbyCode: string;
  players: string[];
  numOfVoters: number;
  currentQuestionIndex: number;
  numQuestions: number;
  selectedQuestions: string[];
  iterator: Iterator<string>;
  votes: { [key: string]: number };
  playerScores: { [key: string]: number };
  readyForNextQuestion: { [key: string]: boolean };
  isReadyToGame: { [key: string]: boolean };
  isGameStarted: boolean;
}

function handleToggleisReadyToGame(data: { lobbyCode: string, playerName: string }) {
  console.log('handleLobbycode ', data.lobbyCode);
  socket.emit(c.TOGGLE_IS_READY_TO_GAME, data);
}

const Lobby: React.FC = () => {

  const [game, setGame] = useState<Game | undefined>(undefined);
  const { currentLobby, currentPlayer, setCurrentLobby } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {

    document.title = `Lobby - ${currentLobby}`;

    socket.emit(c.REQUEST_RENDER_LOBBY, currentLobby, (data: Game) => {
      console.log('Received data:', data);
      setGame(data);
      setIsReady(data.isReadyToGame[currentPlayer!]);
    });
    socket.on(c.RENDER_LOBBY, (data: Game) => {
      setGame(data);
      setIsReady(data.isReadyToGame[currentPlayer!]);
    });
    socket.on(c.INIZIA, () => {
      setGame((prevGame) => prevGame ? { ...prevGame, isGameStarted: true } : undefined);
      navigate('/game');
    });

    return () => {
      socket.off(c.INIZIA);
    };
  }, [currentLobby, navigate, currentPlayer]);

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    handleToggleisReadyToGame({ lobbyCode: currentLobby!, playerName: currentPlayer! });
  };

  const goBackToLobbyList = () => {
    console.log('Remove from lobby: ', currentPlayer, ' ', currentLobby);
    socket.emit(c.EXIT_LOBBY, { currentPlayer, currentLobby });
    setCurrentLobby(undefined);
    navigate('/');
  };

  // TODO load page
  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 id="lobbyCodeTitle">{game.lobbyCode}</h1>
      </div>

      <hr />

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Players</th>
            </tr>
          </thead>
          <tbody id="playersTable">
            {game.players.map((player) => (
              <tr key={player} className={game.isReadyToGame[player] ? 'color-ok' : 'color-ko'}>
                <td>{player}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button
          id="toggleisReadyToGame"
          className={`btn ${isReady ? 'btn-success' : 'btn-secondary'}`}
          onClick={() => toggleReady()}>
          {isReady ? 'Ready' : 'Not Ready'}
        </button>
      </div>
      <div className="text-center mt-4">
        <button
          onClick={() => goBackToLobbyList()}
          className="btn btn-primary">Indietro
        </button>
      </div>
    </div>
  );
};

export default Lobby;
