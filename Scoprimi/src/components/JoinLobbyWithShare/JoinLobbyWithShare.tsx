
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../login/Login';
import { socket } from '../../ts/socketInit';
import { useSession } from '../../contexts/SessionContext';
import * as c from '../../../../Server/src/socketConsts.js';

const JoinLobbyWithShare = () => {
  const navigate = useNavigate();
  const { lobbyCode } = useParams();
  const { currentPlayer, currentPlayerImage, setCurrentLobby } = useSession();

  function handleJoinGame(lobbyCode: string) {

    const data = {
      lobbyCode: lobbyCode,
      playerName: currentPlayer,
      image: currentPlayerImage,
    };
    socket.emit(c.REQUEST_TO_JOIN_LOBBY, data);
  }

  socket.on(c.PLAYER_CAN_JOIN, (data) => {
    if (data.canJoin) {
      setCurrentLobby(data.lobbyCode);
      navigate('/lobby');
    } else {
      alert('Sei già in questa lobby');
    }
  });

  return (
    <Login onButtonClick={() => handleJoinGame(lobbyCode)} />
  );
};

export default JoinLobbyWithShare;
