import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../Server/src/socketConsts.js';
import { socket } from '../ts/socketInit.ts';

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

function handleCreateGame(numQuestions: number) {
  const code = generateLobbyCode();
  socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
}

const Home: React.FC = () => {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const navigate = useNavigate();

  function handleJoinGame(lobbyCode: string, playerName: string) {
    if (playerName === '') {
      alert('Inserisci un nome utente');
      return;
    }
    const data = {
      lobbyCode: lobbyCode,
      playerName: playerName,
    };
    socket.emit(c.REQUEST_TO_JOIN_LOBBY, data);
  }

  useEffect(() => {
    socket.emit(c.REQUEST_RENDER_LOBBIES);
    socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
      setLobbies(lobbies);
    });

    socket.on(c.PLAYER_CAN_JOIN, (data) => {
      if (data.canJoin) {
        const queryParams = new URLSearchParams({ lobbyCode: data.lobbyCode, playerName: data.playerName });
        navigate(`/lobby?${queryParams.toString()}`);
      } else {
        alert('Sei gia in questa lobby')
      }
    });
  }, [navigate]);


  return (
    <div className="container mt-5">
      <h1 className="text-center">Nome Gioco</h1>
      <div className="text-center mt-4">
        <button id="createGameBtn" className="btn btn-primary" onClick={() => handleCreateGame(numQuestions)}>
          Crea una Partita
        </button>
      </div>
      <div className="text-center mt-4">
        <label htmlFor="numQuestions">Numero domande:</label>
        <input
          type="number"
          id="numQuestions"
          min="5"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="form-control w-25 mx-auto"
        />
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <input
              type="text"
              id="playerNameInput"
              className="form-control mb-3"
              placeholder="Inserisci il tuo nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2>Lobby attive</h2>
        <table id="lobbiesList" className="table table-bordered">
          <thead>
            <tr>
              <th>Codice Lobby</th>
              <th>Num Giocatori</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {/* qua ci finisono le lobby */}
            {lobbies.map((lobby) => (
              <tr key={lobby.lobbyCode}>
                <td>{lobby.lobbyCode}</td>
                <td>{lobby.players.length}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleJoinGame(lobby.lobbyCode, playerName)}>
                    Join
                  </button>
                </td>
              </tr>
            ))}
            {/* qua ci finisono le lobby */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
