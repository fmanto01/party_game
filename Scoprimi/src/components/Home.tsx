import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../Server/src/socketConsts.js';
import { socket } from '../ts/socketInit.ts';
import { Game } from '../../../Server/src/data/Game.ts';
import LobbyList from './LobbyList.tsx';
import CreateGameForm from './CreateGameForm.tsx';
import PlayerNameInput from './PlayerNameInput.tsx';
import { useSession } from '../contexts/SessionContext.tsx';

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const Home: React.FC = () => {
  const { currentPlayer, setCurrentPlayer: setPlayerName, setCurrentLobby } = useSession();
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const navigate = useNavigate();

  function handleCreateGame() {
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
  }

  function handleJoinGame(lobbyCode: string) {
    if (currentPlayer === '' || currentPlayer === undefined) {
      alert('Inserisci un nome utente');
      return;
    }
    const data = {
      lobbyCode: lobbyCode,
      playerName: currentPlayer,
    };
    socket.emit(c.REQUEST_TO_JOIN_LOBBY, data);
  }

  useEffect(() => {
    document.title = 'ScopriMi';
  });

  useEffect(() => {
    socket.emit(c.REQUEST_RENDER_LOBBIES);
    socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
      console.log(lobbies);
      setLobbies(lobbies);
    });

    socket.on(c.PLAYER_CAN_JOIN, (data) => {
      if (data.canJoin) {
        setCurrentLobby(data.lobbyCode);
        navigate('/lobby');
      } else {
        alert('Sei già in questa lobby');
      }
    });

    return () => {
      socket.off(c.RENDER_LOBBIES);
      socket.off(c.PLAYER_CAN_JOIN);
    };
  }, [navigate, setCurrentLobby]);

  return (
    <div className="container mt-5">
      <h1 className="text-center">ScopriMi</h1>
      <CreateGameForm
        numQuestions={numQuestions}
        onNumQuestionsChange={setNumQuestions}
        onCreateGame={handleCreateGame}
      />
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <PlayerNameInput playerName={currentPlayer || ''} onPlayerNameChange={setPlayerName} />
        </div>
      </div>
      <div className="mt-5">
        <h2>Lobby attive</h2>
        <LobbyList lobbies={lobbies} onJoin={handleJoinGame} playerName={currentPlayer || ''} />
      </div>
    </div>
  );
};

export default Home;
