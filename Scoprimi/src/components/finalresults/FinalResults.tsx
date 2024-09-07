import { FinalResultData } from '../../ts/types';
import { useLocation, useNavigate } from 'react-router-dom';

const FinalResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { finalResults } = location.state as { finalResults: FinalResultData };

  // Ordinamento con tipizzazione
  const sortedResults = Object.entries(finalResults)
    .sort(([, a], [, b]) => (b.score - a.score)); // Ordina per punteggio decrescente

  // Verifica se finalResults è definito
  if (!finalResults) {
    return <div className="text-center mt-5">Nessun risultato disponibile.</div>;
  }

  return (
    <>
      <div id="gameOverMessage" className="paginator">
        <h2 className="">Classifica</h2>
        {/* TODO podium */}
        <div>
        </div>

        {/* non-podium players */}
        <div className="elegant-background mt-3 scrollable fill">
          <table className="my-table">
            <tbody>
              {sortedResults.map(([player, { score, image }]) => (
                <tr key={player}>
                  <td>
                    <img
                      src={image}
                      alt={`${player} avatar`}
                      style={{ width: '40px', height: '40px', borderRadius: '10%' }} />
                  </td>
                  <td>{player}</td>
                  <td>{score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          className='my-btn mt-3 my-bg-tertiary'
          onClick={() => navigate('/')}
        >
          Torna alla homepage
        </button>
      </div>
    </>
  );
};

export default FinalResults;
