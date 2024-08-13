import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h1>Errore</h1>
      <p>Non hai i permessi necessari per accedere a questa pagina.</p>
      <button className="btn btn-primary" onClick={() => navigate('/')}>Torna alla Home</button>
    </div>
  );
};

export default ErrorPage;
