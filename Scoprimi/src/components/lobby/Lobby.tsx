import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts.js';
import { socket } from '../../ts/socketInit.ts';
import { useSession } from '../../contexts/SessionContext.tsx';
import Navbar from '../common/Navbar.tsx';
import { useNavbar } from '../../contexts/NavbarContext.tsx';
import LobbyList from '../common/LobbyList.tsx';
import { Game } from '../../../../Server/src/data/Game.ts';

function handleToggleisReadyToGame(data: { lobbyCode: string, playerName: string }) {
  console.log('handleLobbycode ', data.lobbyCode);
  socket.emit(c.TOGGLE_IS_READY_TO_GAME, data);
}

const Lobby: React.FC = () => {

  const [game, setGame] = useState<Game | undefined>(undefined);
  const { currentLobby, currentPlayer } = useSession();
  const [isReady, setIsReady] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(1);
  }, [setActiveIndex]);

  useEffect(() => {

    document.title = `Lobby - ${currentLobby}`;
    socket.emit(c.REQUEST_RENDER_LOBBY, currentLobby, (data: Game) => {
      console.log('Received data:', data);
      setGame(data);
      setIsReady(data.isReadyToGame[currentPlayer]);
    });
    socket.on(c.RENDER_LOBBY, (data: Game) => {
      setGame(data);
      setIsReady(data.isReadyToGame[currentPlayer]);
    });
    socket.on(c.INIZIA, () => {
      setGame((prevGame) => {
        if (!prevGame) { return undefined; } // Check if prevGame is undefined

        // Return the full previous game state with the updated property
        return Object.assign(Object.create(Object.getPrototypeOf(prevGame)), prevGame, {
          isGameStarted: true,
        });
      });
      navigate('/game');
    });

    return () => {
      socket.off(c.INIZIA);
    };
  }, [currentLobby, navigate, currentPlayer, setActiveIndex]);

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    handleToggleisReadyToGame({ lobbyCode: currentLobby, playerName: currentPlayer });
  };

  // TODO load page
  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="paginator navbar-page">
        <h2>ScopriMi</h2>
        {/* Primo blocco */}
        <div className="elegant-background">
          <LobbyList lobbies={[game]} onJoin={() => void 0} />
        </div>
        {/* Secondo blocco */}
        <div className="elegant-background mt-3 scrollable fill">
          <table className="my-table my-table-players">
            {game.players.map((player) => (
              <tr key={player}>
                <td className="player-image">
                  <img
                    src={game.images[player] || 'default-image-url'}
                    alt={player}
                    className="player-img" />
                </td>
                <td className="player-name">{player}</td>
                <td className="player-status">
                  <span className={`pill ${game.isReadyToGame[player] ? 'my-bg-success' : 'my-bg-error'}`}>
                    {game.isReadyToGame[player] ? 'Ready' : 'Not Ready'}
                  </span>
                </td>
              </tr>
            ))}
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
        {/* <div className="text-center mt-4">
      <button
        onClick={() => goBackToLobbyList()}
        className="btn btn-primary">
        Indietro
      </button>
    </div> */}
      </div>
      <Navbar />
    </>
  );

};

export default Lobby;
