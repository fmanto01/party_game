import React from 'react';

interface ResultsProps {
  resultMessage: string;
}

const Results: React.FC<ResultsProps> = ({ resultMessage }) => (
  <div id="resultsContainer" className="text-center mt-3">
    <div id="resultMessageContainer">
      <p id="resultMessage" dangerouslySetInnerHTML={{ __html: resultMessage }} />
    </div>
  </div>
);

export default Results;
