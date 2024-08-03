import React from "react"

function Lobby() {
  <div class="container mt-5">
    <div class="text-center mb-4">
      <h1 id="lobbyCodeTitle"></h1>
    </div>
    <div class="form-group">
      <label for="numQuestions">Number of Questions:</label>
      <input type="number" min="5" class="form-control" id="numQuestions" placeholder="Number of Questions" />
    </div>

    <hr />

    <div class="table-responsive">
      <table class="table table-bordered">
        <thead class="thead-dark">
          <tr>
            <th>Players</th>
          </tr>
        </thead>
        <tbody id="playersTable">

        </tbody>
      </table>
    </div>
    <div class="text-center mt-4">
      <button id="toggleisReadyToGame" class="btn btn-primary">Toogle ready</button>
    </div>
  </div>
}

export default Lobby;
