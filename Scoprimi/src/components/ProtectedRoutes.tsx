import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  const { currentLobby, currentPlayer } = useSession();

  if (!currentLobby || !currentPlayer) {
    return <Navigate to="/error" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
