import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="paginator">
      <div className='my-error'>
        <h1>Errore</h1>
        <p>Non hai i permessi necessari per accedere a questa pagina.</p>
        <button className="pill my-bg-tertiary" onClick={() => navigate('/')}>Torna alla Home</button>
      </div>
    </div>
  );
};

export default ErrorPage;
