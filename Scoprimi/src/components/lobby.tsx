import React, { useState, useEffect } from 'react';
import { handleToggleisReadyToGame, listenToInizia, listenToRenderLobby, emitRequestRenderLobby } from '../ts/lobby.ts'
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Lobby: React.FC = () => {

  const [game, setGame] = useState<any[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const lobbyCode = queryParams.get('lobbyCode') || '';
  const playerName = queryParams.get('playerName') || '';
  const navigate = useNavigate();


  useEffect(() => {
    emitRequestRenderLobby(lobbyCode);
    listenToRenderLobby(({ game }) => {
      setGame(game);
    });
    listenToInizia(navigate);
  }, [lobbyCode, navigate]);

  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 id="lobbyCodeTitle"></h1>
      </div>
      <div className="form-group">
        <label htmlFor="numQuestions">Number of Questions:</label>
        <input type="number" min="5" className="form-control" id="numQuestions" placeholder="Number of Questions" />
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
              <tr className={game.isReadyToGame[player] ? 'color-ok' : 'color-ko'} >
                <td>player</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button id="toggleisReadyToGame" className="btn btn-primary"
          onClick={() => handleToggleisReadyToGame({ currentLobbyCode: lobbyCode, currentPlayer: playerName })}>
          Toggle ready
        </button>
      </div>
    </div>
  );
}

export default Lobby;