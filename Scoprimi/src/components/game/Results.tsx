import React from 'react';

interface ResultsProps {
  resultMessage: string;
  onNextQuestion: () => void;
}

const Results: React.FC<ResultsProps> = ({ resultMessage, onNextQuestion }) => (
  <div id="resultsContainer" className="text-center mt-3">
    <div id="resultMessageContainer">
      <p id="resultMessage" dangerouslySetInnerHTML={{ __html: resultMessage }} />
    </div>
    <div className="d-flex justify-content-center align-items-center">
      <button
        id="nextQuestionBtn"
        className="pill my-bg-tertiary mt-3"
        onClick={onNextQuestion}
        style={{ marginBottom: '10px' }}
      >
        Prosegui al prossimo turno
      </button>
    </div>
  </div>
);

export default Results;
