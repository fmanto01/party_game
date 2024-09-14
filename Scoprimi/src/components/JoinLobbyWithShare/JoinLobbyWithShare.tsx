
import { useNavigate, useParams } from 'react-router-dom';
import Login from '../login/Login';
import { socket } from '../../ts/socketInit';
import { useSession } from '../../contexts/SessionContext';
import * as c from '../../../../Server/src/socketConsts.js';
import { useState } from 'react';
import Alert from '../common/Alert.js';

const JoinLobbyWithShare = () => {
  const navigate = useNavigate();
  const { lobbyCode } = useParams();
  const [showAlert, setShowAlert] = useState<boolean>(false);
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
      setShowAlert(true);
    }
  });

  return (
    <>
      <Alert text='Sei già in questa lobby' show={showAlert} onHide={() => setShowAlert(false)} />
      <Login onButtonClick={() => handleJoinGame(lobbyCode)} />
    </>
  );
};

export default JoinLobbyWithShare;
