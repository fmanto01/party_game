import { socket } from '../ts/socketInit';
import { JOIN_ROOM } from '../../../Server/src/socketConsts';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SessionContextProps {
  currentLobby: string | undefined;
  setCurrentLobby: (lobby: string | undefined) => void;
  isInLobby: () => boolean;
  currentPlayer: string | undefined;
  setCurrentPlayer: (name: string | undefined) => void;
  currentPlayerImage: string | undefined;
  setCurrentPlayerImage: (image: string | undefined) => void;
}

const SessionContext = createContext<SessionContextProps | undefined>(undefined);

export const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  // Stato della lobby
  const [currentLobby, setCurrentLobby] = useState<string | undefined>(undefined);
  const isInLobby = () => currentLobby !== undefined;

  // Stato del player
  const [currentPlayer, setCurrentPlayer] = useState<string | undefined>(undefined);
  const [currentPlayerImage, setCurrentPlayerImage] = useState<string | undefined>(undefined);

  // stato per load sul refresh
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  useEffect(() => {
    const savedPlayer = sessionStorage.getItem('currentPlayer');
    const savedPlayerImage = sessionStorage.getItem('currentPlayerImage');
    const savedLobby = sessionStorage.getItem('currentLobby');
    console.log(savedLobby, savedPlayer);

    if (savedLobby && savedPlayer && savedPlayerImage) {
      setCurrentLobby(savedLobby);
      setCurrentPlayer(savedPlayer);
      setCurrentPlayerImage(savedPlayerImage);
      socket.emit(JOIN_ROOM, { playerName: savedPlayer, lobbyCode: savedLobby, image: savedPlayerImage });
    } else if (savedLobby && savedPlayer) {
      setCurrentLobby(savedLobby);
      setCurrentPlayer(savedPlayer);
    }

    setInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    if (initialLoadComplete) {
      if (currentPlayer) {
        sessionStorage.setItem('currentPlayer', currentPlayer);
      } else {
        sessionStorage.removeItem('currentPlayer');
      }
    }
  }, [currentPlayer, initialLoadComplete]);

  useEffect(() => {
    if (initialLoadComplete) {
      if (currentPlayerImage) {
        sessionStorage.setItem('currentPlayerImage', currentPlayerImage);
      } else {
        sessionStorage.removeItem('currentPlayerImage');
      }
    }
  }, [currentPlayerImage, initialLoadComplete]);

  useEffect(() => {
    if (initialLoadComplete) {
      if (currentLobby) {
        sessionStorage.setItem('currentLobby', currentLobby);
      } else {
        sessionStorage.removeItem('currentLobby');
      }
    }
  }, [currentLobby, initialLoadComplete]);


  return (
    <SessionContext.Provider
      value={{
        currentLobby,
        setCurrentLobby,
        isInLobby,
        currentPlayer,
        setCurrentPlayer,
        currentPlayerImage,
        setCurrentPlayerImage,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
