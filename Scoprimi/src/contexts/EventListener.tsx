import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from './SessionContext';
import { socket } from '../ts/socketInit';

const PopStateContext = createContext<void>(undefined);

// Hook per usare il contesto
export const useOnPopStateContext = () => {
  const context = useContext(PopStateContext);
  if (context === undefined) {
    throw new Error('useOnPopStateContext must be used within a PageProvider');
  }
  return context;
};


export const PopStateProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentLobby, currentLobby, currentPlayer } = useSession();
  const [currentPage, setCurrentPage] = useState<string>(undefined);

  useEffect(() => {

    // Determina la pagina corrente basandoti sull'URL
    const pathname = location.pathname;
    console.log('pathname', pathname);
    if (pathname.includes('/lobby')) {
      setCurrentPage('lobby');
    } else if (pathname.includes('/game')) {
      setCurrentPage('game');
    } else {
      setCurrentPage(undefined);
    }
  }, [location.pathname]);

  useEffect(() => {
    // Definizione dell'handler per il popstate
    const handlePopState = () => {
      if (currentPage === 'lobby') {
        console.log('@LOBBY');
        socket.emit('exitLobby', { currentPlayer, currentLobby });
        setCurrentLobby(undefined);
        navigate('/', { replace: true });
      } else if (currentPage === 'game') {
        console.log('@GAME');
        socket.emit('mydisconnet');
        navigate('/', { replace: true });
      }
    };

    // Aggiungi l'evento popstate quando il componente viene montato
    window.addEventListener('popstate', handlePopState);

  }, [currentPage, currentPlayer, currentLobby, navigate, setCurrentLobby]);

  return (
    <PopStateContext.Provider value={undefined}>
      {children}
    </PopStateContext.Provider>
  );
};
