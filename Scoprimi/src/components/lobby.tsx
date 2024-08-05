import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { handleToggleisReadyToGame, listenToInizia, listenToRenderLobby, emitRequestRenderLobby } from '../ts/lobby.ts'

const Lobby: React.FC = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [game, setGame] = useState<any[]>([]);
  const [lobbyCode, setlobbyCode] = useState<string>(queryParams.get('lobbyCode') || '')
  const [playerName, setplayerName] = useState<string>(queryParams.get('playerName') || '')
  const navigate = useNavigate();

  useEffect(() => {
    console.log(lobbyCode);
    emitRequestRenderLobby(lobbyCode);
    listenToRenderLobby(({ game }) => {
      setGame(game);
    });
    listenToInizia(navigate);
  }, [lobbyCode, navigate, game]);

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