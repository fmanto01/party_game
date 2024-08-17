import React from 'react';

interface QuestionProps {
  question: string;
}

const Question: React.FC<QuestionProps> = ({ question }) => (
  <div id="questionContainer" className="mt-3 text-center">
    <h3 id="question">{question}</h3>
  </div>
);

export default Question;
