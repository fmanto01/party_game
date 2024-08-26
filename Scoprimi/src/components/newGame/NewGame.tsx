import { useState } from 'react';

const NewGame = () => {
  const [numQuestions, setNumQuestions] = useState(5);

  // Funzione per incrementare il numero di domande
  const increment = () => {
    if (numQuestions < 50) {
      setNumQuestions(numQuestions + 1);
    }
  };

  // Funzione per decrementare il numero di domande
  const decrement = () => {
    if (numQuestions > 5) {
      setNumQuestions(numQuestions - 1);
    }
  };

  // Funzione per gestire l'input manuale
  const handleInputChange = (stringValue: string) => {
    let value = parseInt(stringValue);
    if (isNaN(value)) {
      value = 5; // Default value se l'input non è un numero valido
    }

    if (value > 50) {
      value = 50;
    } else if (value < 5) {
      value = 5;
    }

    setNumQuestions(value);
  };

  // Funzione per creare la lobby
  const createLobby = () => {
    console.log(`Creando una lobby con ${numQuestions} domande.`);
    // Qui puoi aggiungere la logica per creare la lobby
  };

  return (
    <div className="new-game">
      <h1>Imposta il numero di domande</h1>
      <div className="counter">
        <button onClick={decrement}>-</button>
        <input
          type="number"
          value={numQuestions}
          onChange={(e) => handleInputChange(e.target.value)}
          min="5"
          max="50"
        />
        <button onClick={increment}>+</button>
      </div>
      <button onClick={createLobby} className="btn btn-primary mt-3">
        Crea Lobby
      </button>
    </div>
  );
};

export default NewGame;
