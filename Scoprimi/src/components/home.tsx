import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../Server/src/socketConsts.js';
import { socket, UID } from '../ts/socketInit.ts';
import { Game } from '../../../Server/src/data/Game.ts';
import LobbyList from './LobbyList.tsx';
import CreateGameForm from './CreateGameForm.tsx';
import PlayerNameInput from './PlayerNameInput.tsx';

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const Home: React.FC = () => {
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const navigate = useNavigate();

  function handleCreateGame() {
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
  }

  function handleJoinGame(lobbyCode: string, playerName: string) {
    if (playerName === '') {
      alert('Inserisci un nome utente');
      return;
    }
    const data = {
      lobbyCode: lobbyCode,
      playerName: playerName,
      uid: UID,
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
        alert('Sei gia in questa lobby');
      }
    });

    return () => {
      socket.off(c.RENDER_LOBBIES);
      socket.off(c.PLAYER_CAN_JOIN);
    };
  }, [navigate]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">Nome Gioco</h1>
      <CreateGameForm
        numQuestions={numQuestions}
        onNumQuestionsChange={setNumQuestions}
        onCreateGame={handleCreateGame}
      />
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <PlayerNameInput playerName={playerName} onPlayerNameChange={setPlayerName} />
        </div>
      </div>
      <div className="mt-5">
        <h2>Lobby attive</h2>
        <LobbyList lobbies={lobbies} onJoin={handleJoinGame} playerName={playerName} />
      </div>
    </div>
  );
};

export default Home;