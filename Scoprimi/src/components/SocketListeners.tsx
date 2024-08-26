import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../Server/src/socketConsts';

import { socket } from '../ts/socketInit';

const SocketListener = () => {
  const navigate = useNavigate();

  useEffect(() => {
    socket.on(c.FORCE_RESET, () => {
      sessionStorage.removeItem('currentQuestion');
      sessionStorage.removeItem('players');
      sessionStorage.removeItem('currentLobby');
      navigate('/error');
    });

    return () => {
      socket.off(c.FORCE_RESET);
    };
  }, [navigate]);

  return null;
};

export default SocketListener;
