import { useEffect, useState } from 'react';
import { socket } from '../../ts/socketInit';
import * as c from '../../../../Server/src/socketConsts.js';
import Navbar from '../common/Navbar.js';
import { useNavbar } from '../../contexts/NavbarContext.js';

function generateLobbyCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

const NewGame = () => {
  const [numQuestions, setNumQuestions] = useState(5);
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(2);
  }, [setActiveIndex]);

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


  function handleCreateGame() {
    const code = generateLobbyCode();
    socket.emit(c.CREATE_LOBBY, [code, numQuestions]);
  }

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
      <button onClick={() => handleCreateGame()} className="btn btn-primary mt-3">
        Crea Lobby
      </button>
      <Navbar />
    </div >
  );
};

export default NewGame;
