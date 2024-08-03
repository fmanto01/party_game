import React from "react";

function Home() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Nome Gioco</h1>
      <div className="text-center mt-4">
        <button id="createGameBtn" className="btn btn-primary">Crea una Partita</button>
      </div>
      <div className="text-center mt-4">
        <label htmlFor="numQuestions">Numero domande:</label>
        <input type="number" id="numQuestions" min="5" defaultValue="5" className="form-control w-25 mx-auto" />
      </div>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6">
          <div className="form-group">
            <input type="text" id="playerNameInput" className="form-control mb-3" placeholder="Inserisci il tuo nome" />
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
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Home;
