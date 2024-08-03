import React from "react";

function Lobby() {
  return (
    <div className="container mt-5">
      <div className="text-center mb-4">
        <h1 id="lobbyCodeTitle"></h1>
      </div>
      <div className="form-group">
        <label htmlFor="numQuestions">Number of Questions:</label>
        <input type="number" min="5" className="form-control" id="numQuestions" placeholder="Number of Questions" />
      </div>

      <hr />

      <div className="table-responsive">
        <table className="table table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Players</th>
            </tr>
          </thead>
          <tbody id="playersTable">

          </tbody>
        </table>
      </div>
      <div className="text-center mt-4">
        <button id="toggleisReadyToGame" className="btn btn-primary">Toggle ready</button>
      </div>
    </div>
  );
}

export default Lobby;
