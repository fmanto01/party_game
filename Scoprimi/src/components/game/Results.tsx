import React from 'react';

interface ResultsProps {
  resultMessage: string;
  voteRecap: { [key: string]: string };
  playerImages: { [key: string]: string };
  mostVotedPerson: string;
}

const Results: React.FC<ResultsProps> = ({ resultMessage, voteRecap, playerImages, mostVotedPerson }) => (
  <div id="resultsContainer" className="text-center mt-3">
    <div id="resultMessageContainer">
      <p id="resultMessage">{resultMessage}</p>
      {
        Object.entries(voteRecap).map(([voter, vote]) => (
          <div key={voter} className="voteEntry">
            <div className="voteEntryContent">
              <img
                src={playerImages[voter]}
                alt={voter}
                className="voteEntryImage"
              />
              <p className="voteEntryText">
                {voter} {vote ? 'ha votato' : 'non ha votato'}{' '}
                {vote && (
                  <span
                    className={`status-pill-vote ${mostVotedPerson === vote ? 'my-bg-success' : 'my-bg-error'}`}
                  >
                    {vote}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))
      }
    </div>
  </div>
);

export default Results;
