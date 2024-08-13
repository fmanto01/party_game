import { createContext, useState, useContext, ReactNode } from 'react';


const SessionContext = createContext<{
  currentLobby: string | undefined;
  enterLobby: (lobbyCode: string) => void;
  leaveLobby: () => void;
  isInLobby: () => boolean;
} | undefined>(undefined);

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: ReactNode }) => {

  const [currentLobby, setcurrentLobby] = useState<string | undefined>();
  const enterLobby = (lobbyCode: string) => setcurrentLobby(lobbyCode);
  const leaveLobby = () => setcurrentLobby(undefined);
  const isInLobby = () => currentLobby !== undefined;

  return (
    <SessionContext.Provider value={{ currentLobby, enterLobby, leaveLobby, isInLobby }}>
      {children}
    </SessionContext.Provider>
  );
};
