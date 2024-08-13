import { createContext, useState, useContext, ReactNode } from 'react';

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
