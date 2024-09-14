import React from 'react';
import { useNavigate } from 'react-router-dom';

const Page404: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="paginator">
      <div className='my-error'>
        <h1>404</h1>
        <p>Pagina non trovata, dove stai andando fratello?</p>
        <button className="my-btn my-bg-tertiary" onClick={() => navigate('/')}>Torna alla Home</button>
      </div>
    </div>
  );
};

export default Page404;
