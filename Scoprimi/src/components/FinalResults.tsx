import React from 'react';
import { FinalResultsData } from '../ts/types';
import { useLocation, useNavigate } from 'react-router-dom';

const FinalResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalResults } = location.state as { finalResults: FinalResultsData };

  // Verifica se finalResults è definito
  if (!finalResults) {
    return <div className="text-center mt-5">Nessun risultato disponibile.</div>;
  }

  // Funzione per tornare alla home
  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div id="gameOverMessage" className="container mt-5">
      <h2 className="text-primary mb-4">Classifica</h2>
      <div id="finalResultsContainer" className="table-responsive mb-4">
        <table className="table table-bordered table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Posizione</th>
              <th>Giocatore</th>
              <th>Punti</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(finalResults)
              .sort((a, b) => b[1] - a[1]) // Ordina per punteggio decrescente
              .map(([player, score], index) => (
                <tr key={player}>
                  <td>
                    {index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                  </td>
                  <td>{player}</td>
                  <td>{score}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={handleBackToHome}
        >
          Torna alla Home
        </button>
      </div>
    </div>
  );
};

export default FinalResults;
