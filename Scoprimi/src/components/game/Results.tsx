import React from 'react';

interface ResultsProps {
  resultMessage: string;
  onNextQuestion: () => void;
}

const Results: React.FC<ResultsProps> = ({ resultMessage, onNextQuestion }) => (
  <div id="resultsContainer" className="text-center mt-3">
    <div id="resultMessageContainer">
      <h3 id="resultMessage" dangerouslySetInnerHTML={{ __html: resultMessage }} />
    </div>
    <div className="d-flex justify-content-center align-items-center">
      <button
        id="nextQuestionBtn"
        className="btn btn-primary mt-3 w-100"
        onClick={onNextQuestion}
        style={{ marginBottom: '10px' }}
      >
        Prosegui al prossimo turno
      </button>
    </div>
  </div>
);

export default Results;