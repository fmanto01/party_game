import React from 'react';
import { FinalResultsData } from '../ts/types';
import { useLocation } from 'react-router-dom';


const FinalResults: React.FC = () => {
  const location = useLocation();
  const { finalResults } = location.state as { finalResults: FinalResultsData };
  console.log(finalResults);
  return (
    < div id="gameOverMessage" className="text-center mt-5" >
      <h2>Classifica</h2>
      <div id="finalResultsContainer">
        <table className="table">
          <thead>
            <tr>
              <th>Posizione</th>
              <th>Giocatore</th>
              <th>Punti</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(finalResults)
              .sort((a, b) => b[1] - a[1])
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
    </div >);
};

export default FinalResults;
