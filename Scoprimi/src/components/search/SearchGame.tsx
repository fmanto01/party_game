import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts.js';
import { socket } from '../../ts/socketInit.ts';
import { Game } from '../../../../Server/src/data/Game.ts';
import LobbyList from '../common/LobbyList.tsx';
import { useSession } from '../../contexts/SessionContext.tsx';
import Navbar from '../common/Navbar.tsx';
import { useNavbar } from '../../contexts/NavbarContext.tsx';

const SearchGame: React.FC = () => {
  const { currentPlayer, setCurrentLobby, currentPlayerImage, isSetPlayer } = useSession();
  const [lobbies, setLobbies] = useState<Game[]>([]);
  const [filteredLobbies, setFilteredLobbies] = useState<Game[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Aggiunto lo stato searchTerm
  const navigate = useNavigate();
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(3);
  }, [setActiveIndex]);

  function handleJoinGame(lobbyCode: string) {
    if (!currentPlayer) {
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

  function filterLobbies(event: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm === '') {
      setFilteredLobbies([]);
    } else {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = lobbies.filter(lobby =>
        lobby.lobbyCode.toLowerCase().includes(lowercasedSearchTerm),
      );
      setFilteredLobbies(filtered);
    }
  }

  useEffect(() => {
    document.title = 'ScopriMi';
  }, []);

  useEffect(() => {
    socket.emit(c.REQUEST_RENDER_LOBBIES);
    socket.on(c.RENDER_LOBBIES, ({ lobbies }) => {
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
    <>
      <div className="paginator navbar-page">
        <h2>ScopriMi</h2>
        {/* Primo blocco */}
        <div className='elegant-background'>
          <p>Codice lobby:</p>
          <input
            type="text"
            className='my-input fill-input my-bg-tertiary'
            value={searchTerm}
            onChange={filterLobbies} />
        </div>
        {/* Secondo blocco */}
        <div className="elegant-background mt-3 fill scrollable">
          <LobbyList
            lobbies={searchTerm !== '' ? filteredLobbies : lobbies}
            onJoin={handleJoinGame} />
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default SearchGame;
