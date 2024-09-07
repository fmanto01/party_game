import React, { useState } from 'react';

interface BottomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGame: () => void;
}

const BottomModal: React.FC<BottomModalProps> = ({ isOpen, onClose, onCreateGame }) => {
  const [numQuestions, setNumQuestions] = useState(5);

  const increment = () => {
    if (numQuestions < 50) {
      setNumQuestions(numQuestions + 1);
    }
  };

  const decrement = () => {
    if (numQuestions > 5) {
      setNumQuestions(numQuestions - 1);
    }
  };

  const handleInputChange = (stringValue: string) => {
    let value = parseInt(stringValue);
    if (isNaN(value)) {
      value = 5;
    }

    if (value > 50) {
      value = 50;
    } else if (value < 5) {
      value = 5;
    }

    setNumQuestions(value);
  };

  if (!isOpen) { return null; }

  return (
    <div className="bottom-modal">
      <div className="bottom-modal-content">
        <button className="bottom-modal-close" onClick={onClose}>X</button>
        <div className="paginator">
          <h2>ScopriMi</h2>
          <div className="elegant-background">
            <p>Numero di domande:</p>
            <div className="counter mb-4">
              <button className="btn-change-value" onClick={decrement}>-</button>
              <input
                type="number"
                className="my-input stretch text-center"
                value={numQuestions}
                onChange={(e) => handleInputChange(e.target.value)}
                min="5"
                max="50" />
              <button className="btn-change-value" onClick={increment}>+</button>
            </div>
            <div className='counter pt-3'>
              <button onClick={onCreateGame} className="btn-pill">Create</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BottomModal;
