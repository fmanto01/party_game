import { socket } from '../ts/socketInit';
import { JOIN_ROOM } from '../../../Server/src/socketConsts';
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface SessionContextProps {
  currentLobby: string | undefined;
  setCurrentLobby: (lobby: string | undefined) => void;
  isInLobby: () => boolean;
  currentPlayer: string | undefined;
  setCurrentPlayer: (name: string) => void;
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

  // salvo player nella sessione locale
  useEffect(() => {
    if (currentPlayer) {
      sessionStorage.setItem('currentPlayer', currentPlayer);
    }
  }, [currentPlayer]);

  // salvo lobby nella sessione locale
  useEffect(() => {
    if (currentLobby) {
      console.log('cambio lobby');
      sessionStorage.setItem('currentLobby', currentLobby);
    }
  }, [currentLobby]);

  // Ristabilire il contesto con i valori salvati in sessionStorage
  useEffect(() => {
    const savedPlayer = sessionStorage.getItem('currentPlayer');
    const savedLobby = sessionStorage.getItem('currentLobby');
    console.log(savedLobby, savedPlayer);
    if (savedLobby && savedPlayer) {
      setCurrentLobby(savedLobby);
      setCurrentPlayer(savedPlayer);
      socket.emit(JOIN_ROOM, { playerName: savedPlayer, lobbyCode: savedLobby });
    }
  }, []);

  return (
    <SessionContext.Provider
      value={{
        currentLobby,
        setCurrentLobby,
        isInLobby,
        currentPlayer,
        setCurrentPlayer,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};
