import React from 'react';
import { FinalResultData } from '../../ts/types';
import { useLocation, useNavigate } from 'react-router-dom';

const FinalResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalResults } = location.state as { finalResults: FinalResultData };

  // Verifica se finalResults è definito
  if (!finalResults) {
    return <div className="text-center mt-5">Nessun risultato disponibile.</div>;
  }

  // Funzione per tornare alla home
  const handleBackToHome = () => {
    navigate('/');
  };

  // Ordinamento con tipizzazione
  const sortedResults = Object.entries(finalResults)
    .sort(([, a], [, b]) => (b.score - a.score)); // Ordina per punteggio decrescente

  return (
    <div id="gameOverMessage" className="container mt-5">
      <h2 className="text-primary mb-4">Classifica</h2>
      <div id="finalResultsContainer" className="table-responsive mb-4">
        <table className="table table-bordered table-striped table-hover">
          <tbody>
            {sortedResults.map(([player, { score, image }], index) => (
              <tr key={player}>
                <td>
                  {index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                </td>
                <td>
                  <img
                    src={image}
                    alt={`${player} avatar`}
                    style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                  />
                </td>
                <td>{player}</td>
                <td>{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleBackToHome}>
          Torna alla Home
        </button>
      </div>
    </div>
  );
};

export default FinalResults;
