import React from 'react';

interface QuestionProps {
  question: string;
}

const Question: React.FC<QuestionProps> = ({ question }) => (
  <div id="questionContainer">
    <h4 id="question">{question}</h4>
  </div>
);

export default Question;
