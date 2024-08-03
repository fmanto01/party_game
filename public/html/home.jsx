import React from "react"

function Home() {
  <div class="container mt-5">
    <h1 class="text-center">Nome Gioco</h1>
    <div class="text-center mt-4">
      <button id="createGameBtn" class="btn btn-primary">Crea una Partita</button>
    </div>
    <div class="text-center mt-4">
      <label for="numQuestions">Numero domande:</label>
      <input type="number" id="numQuestions" min="5" value="5" class="form-control w-25 mx-auto" />
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-6">
        <div class="form-group">
          <input type="text" id="playerNameInput" class="form-control mb-3"
            placeholder="Inserisci il tuo nome" />
        </div>
      </div>
    </div>
    <div class="mt-5">
      <h2>Lobby attive</h2>
      <table id="lobbiesList" class="table table-bordered">
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
}

export default Home;