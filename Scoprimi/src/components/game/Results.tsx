import React from 'react';

interface ResultsProps {
  resultMessage: string;
  voteRecap: { [key: string]: string }
}

const Results: React.FC<ResultsProps> = ({ resultMessage, voteRecap }) => (
  <div id="resultsContainer" className="text-center mt-3">
    <div id="resultMessageContainer">
      <p id="resultMessage">{resultMessage}</p>
      {
        Object.entries(voteRecap).map(([voter, vote]) => (
          <div key={voter}>
            <p>{voter} {vote ? `ha votato ${vote}` : 'non ha votato'}</p>
          </div>
        ))
      }
    </div>
  </div >
);

export default Results;
