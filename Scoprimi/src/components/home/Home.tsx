import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts.js';
import { socket } from '../../ts/socketInit.ts';
import { Game } from '../../../../Server/src/data/Game.ts';
import LobbyList from '../common/LobbyList.tsx';
import { useSession } from '../../contexts/SessionContext.tsx';
import Navbar from '../common/Navbar.tsx';
import { useNavbar } from '../../contexts/NavbarContext.tsx';

const Home: React.FC = () => {
  const { currentPlayer, setCurrentLobby, currentPlayerImage, isSetPlayer } = useSession();
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const navigate = useNavigate();
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(0);
  }, [setActiveIndex]);

  function handleJoinGame(lobbyCode: string) {
    if (!isSetPlayer) {
      alert('Inserisci un nome utente');
      return;
    }
    const data = {
      lobbyCode: lobbyCode,
      playerName: currentPlayer,
      image: currentPlayerImage,
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

  useEffect(() => {
    if (!isSetPlayer) {
      navigate('/login');
    }
  }, [isSetPlayer, navigate]);

  return (
    <div>
      <div className="container mt-5">
        <h1 className="text-center">ScopriMi</h1>
        <div className="mt-5">
          <h2>Lobby attive</h2>
          <LobbyList lobbies={lobbies} onJoin={handleJoinGame} />
        </div>
        <Navbar />
      </div>
    </div>
  );
};

export default Home;
