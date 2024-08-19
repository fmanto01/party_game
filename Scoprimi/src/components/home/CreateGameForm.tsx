import { useState } from 'react';

interface CreateGameFormProps {
  numQuestions: number;
  onNumQuestionsChange: (numQuestions: number) => void;
  onCreateGame: () => void;
  onFilterLobbies: (filter: string) => void;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({ numQuestions, onNumQuestionsChange, onCreateGame, onFilterLobbies }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearchChange = (newSearchTerm: string) => {
    console.log('mewSeartchterm');
    console.log(newSearchTerm);
    setSearchTerm(newSearchTerm);
    onFilterLobbies(newSearchTerm);
  };

  return (
    <div className="text-center mt-4">
      <label htmlFor="numQuestions">Numero domande:</label>
      <input
        type="number"
        id="numQuestions"
        min="5"
        value={numQuestions}
        onChange={(e) => onNumQuestionsChange(parseInt(e.target.value))}
        className="form-control w-25 mx-auto"
      />
      <button id="createGameBtn" className="btn btn-primary mt-3" onClick={onCreateGame}>
        Crea una Partita
      </button>
      <button id="Cerca Game" className="btn btn-primary mt-3" onClick={() => setIsShow(!isShow)}>
        Cerca
      </button>
      {isShow && (
        <input
          type="text"
          placeholder="Cerca per codice lobby"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="form-control w-25 mx-auto mt-2"
        />
      )}
    </div>
  );
};

export default CreateGameForm;
