import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as c from '../../../Server/src/socketConsts.js';
import { socket } from '../ts/socketInit.ts';

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

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [game, setGame] = useState<Game | undefined>(undefined);
  const [isReady, setIsReady] = useState<boolean>(false);
  const lobbyCode = queryParams.get('lobbyCode') || '';
  const playerName = queryParams.get('playerName') || '';
  const navigate = useNavigate();

  useEffect(() => {
    socket.emit(c.REQUEST_RENDER_LOBBY, lobbyCode, (data: Game) => {
      console.log('Received data:', data);
      setGame(data);
      setIsReady(data.isReadyToGame[playerName]); // Initialize isReady based on server data
    });
    socket.on(c.RENDER_LOBBY, (data: Game) => {
      setGame(data);
      setIsReady(data.isReadyToGame[playerName]); // Update isReady when game state updates
    });
    socket.on(c.INIZIA, () => {
      // Update the game state to indicate it has started
      setGame((prevGame) => prevGame ? { ...prevGame, isGameStarted: true } : undefined);
      const queryParams = new URLSearchParams({ lobbyCode, playerName });
      navigate(`/game?${queryParams.toString()}`);
    });

    return () => {
      socket.off(c.INIZIA);
    };
  }, [lobbyCode, navigate, playerName]);

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    handleToggleisReadyToGame({ lobbyCode: lobbyCode, playerName: playerName });
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
          onClick={toggleReady}
        >
          {isReady ? 'Ready' : 'Not Ready'}
        </button>
      </div>
    </div>
  );
};

export default Lobby;