// Home.tsx
import React, { useState, useEffect } from 'react';
import { handleCreateGame, updateLobbies, socket, initializeSocket } from '../../public/ts/home.ts'; // Assicurati che il percorso sia corretto

const Home: React.FC = () => {
  const [lobbies, setLobbies] = useState<any[]>([]);
  const [playerName, setPlayerName] = useState<string>('');
  const [numQuestions, setNumQuestions] = useState<number>(5);

  useEffect(() => {
    // Inizializza socket e gestisci l'aggiornamento delle lobby
    initializeSocket(setLobbies);

    // Funzione per aggiornare le lobby
    const intervalId = setInterval(updateLobbies, 2000);

    // Pulizia dell'intervallo e dell'ascoltatore del socket
    return () => {
      clearInterval(intervalId);
      socket.off(); // Pulisce tutti gli ascoltatori per evitare memory leaks
    };
  }, []);

  const handleJoinLobby = (lobbyCode: string) => {
    if (playerName === '') {
      alert('Inserisci un nome utente');
      return;
    }
    const data = {
      lobbyCode,
      playerName,
    };
    console.log(data);
    socket.emit(c.JOIN_LOBBY, data);
    window.location.href = `/lobby.html/?lobbyCode=${data.lobbyCode}&name=${data.playerName}`;
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Nome Gioco</h1>
      <div className="text-center mt-4">
        <button id="createGameBtn" className="btn btn-primary" onClick={() => handleCreateGame(numQuestions)}>
          Crea una Partita
        </button>
      </div>
      <div className="text-center mt-4">
        <label htmlFor="numQuestions">Numero domande:</label>
        <input
          type="number"
          id="numQuestions"
          min="5"
          value={numQuestions}
          onChange={(e) => setNumQuestions(parseInt(e.target.value))}
          className="form-control w-25 mx-auto"
        />
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <input
              type="text"
              id="playerNameInput"
              className="form-control mb-3"
              placeholder="Inserisci il tuo nome"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-5">
        <h2>Lobby attive</h2>
        <table id="lobbiesList" className="table table-bordered">
          <thead>
            <tr>
              <th>Codice Lobby</th>
              <th>Num Giocatori</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {/* qua ci finisono le lobby */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;
