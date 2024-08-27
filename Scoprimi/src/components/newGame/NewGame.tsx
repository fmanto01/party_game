import { useEffect, useState } from 'react';
import { socket } from '../../ts/socketInit';
import * as c from '../../../../Server/src/socketConsts.js';
import Navbar from '../common/Navbar.js';
import { useNavbar } from '../../contexts/NavbarContext.js';
import { Game } from '../../../../Server/src/data/Game.ts';
import LobbyRow from '../common/SingleLobby.tsx';
import { useSession } from '../../contexts/SessionContext.tsx';
import { useNavigate } from 'react-router-dom';

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const NewGame = () => {
  const navigate = useNavigate();
  const { currentPlayer, currentPlayerImage, isSetPlayer, setCurrentLobby } = useSession();
  const [numQuestions, setNumQuestions] = useState(5);
  const [createdLobby, setCreatedLobby] = useState<Game | null>(null);
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(2);
  }, [setActiveIndex]);

  useEffect(() => {
    socket.on(c.RETURN_NEWGAME, (data: { newGame: Game }) => {
      console.log(data.newGame);
      setCreatedLobby(data.newGame);
    });

    return () => {
      socket.off(c.RETURN_NEWGAME);
    };
  }, []);

  useEffect(() => {
    socket.on(c.PLAYER_CAN_JOIN, (data) => {
      if (data.canJoin) {
        setCurrentLobby(data.lobbyCode);
        navigate('/lobby');
      } else {
        alert('Sei già in questa lobby');
      }
    });

    return () => {
      socket.off(c.PLAYER_CAN_JOIN);
    };
  }, [navigate, setCurrentLobby]);

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

  const increment = () => {
    if (numQuestions < 50) {
      setNumQuestions(numQuestions + 1);
    }
  };

  const decrement = () => {
    if (numQuestions > 5) {
      setNumQuestions(numQuestions - 1);
    }
  };

  const handleInputChange = (stringValue: string) => {
    let value = parseInt(stringValue);
    if (isNaN(value)) {
      value = 5;
    }

    if (value > 50) {
      value = 50;
    } else if (value < 5) {
      value = 5;
    }

    setNumQuestions(value);
  };

  function handleCreateGame() {
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
  }

  return (
    <div className="paginator">
      <h1 className="text-center">ScopriMi</h1>
      {/* Primo blocco */}
      <div className="elegant-background new-game mt-5">
        <div className=" counter mb-4">
          <button className="btn btn-secondary me-2" onClick={decrement}>-</button>
          <input
            type="number"
            className="form-control d-inline-block text-center"
            value={numQuestions}
            onChange={(e) => handleInputChange(e.target.value)}
            min="5"
            max="50"
          />
          <button className="btn btn-secondary ms-2" onClick={increment}>+</button>
        </div>
        <button onClick={handleCreateGame} className="btn btn-success">
          Crea Lobby
        </button>

        {createdLobby && (
          <table className="table table-hover mt-4">
            <tbody>
              <LobbyRow
                lobby={createdLobby}
                onJoin={handleJoinGame}
              />
            </tbody>
          </table>
        )}
      </div>

      <Navbar />
    </div>
  );
};

export default NewGame;
