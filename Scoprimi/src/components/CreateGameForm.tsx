interface CreateGameFormProps {
  numQuestions: number;
  onNumQuestionsChange: (numQuestions: number) => void;
  onCreateGame: () => void;
}

const CreateGameForm: React.FC<CreateGameFormProps> = ({ numQuestions, onNumQuestionsChange, onCreateGame }) => {
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
    </div>
  );
};

export default CreateGameForm;