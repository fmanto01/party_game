import { FinalResultData } from '../../ts/types';
import { useLocation } from 'react-router-dom';

const FinalResults: React.FC = () => {
  const location = useLocation();
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
        {/* podium */}
        <div>
        </div>

        <div className="elegant-background scrollable">
          <table className="my-table">
            {sortedResults.map(([player, { score, image }]) => (
              <tr key={player}>
                <td>
                  <img
                    src={image}
                    alt={`${player} avatar`}
                    style={{ width: '30px', height: '30px', borderRadius: '10%' }} />
                </td>
                <td>{player}</td>
                <td>{score}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </>
  );
};

export default FinalResults;
