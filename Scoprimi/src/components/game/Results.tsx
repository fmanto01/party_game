import React from 'react';

interface ResultsProps {
  voteRecap: { [key: string]: string };
  playerImages: { [key: string]: string };
  mostVotedPerson: string;
}

const Results: React.FC<ResultsProps> = ({ voteRecap, playerImages, mostVotedPerson }) => (
  <div id="resultsContainer" className="text-center">
    <div id="resultMessageContainer">
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
