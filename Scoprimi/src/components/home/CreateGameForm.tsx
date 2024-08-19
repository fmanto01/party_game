import { useState } from 'react';

interface CreateGameFormProps {
  numQuestions: number;
  onNumQuestionsChange: (numQuestions: number) => void;
  onCreateGame: () => void;
  onFilterLobbies: (filter: string) => void; // Aggiungi questa prop per filtrare le lobby
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({ numQuestions, onNumQuestionsChange, onCreateGame, onFilterLobbies }) => {
  const [isShow, setIsShow] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Stato per la ricerca

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    onFilterLobbies(newSearchTerm); // Chiama la funzione di filtro
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
          onChange={handleSearchChange}
          className="form-control w-25 mx-auto mt-2"
        />
      )}
    </div>
  );
};

export default CreateGameForm;
