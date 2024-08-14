import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { currentLobby, currentPlayer } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100); // per dare tempo al contesto di ripristinarsi, altrimento non valorizzato
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // TODO loading figo
  }

  if (!currentLobby || !currentPlayer) {
    return <Navigate to="/error" replace />;
  }

  return <Component />;
};
export default ProtectedRoute;
