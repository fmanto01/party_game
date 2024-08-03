import React from "react";

function Game() {
  <div class="container mt-5">
    <div class="top-container text-center mt-3">
      <div id="timerContainer">
        <h3>⌛: <span id="timer">10</span> secondi</h3>
      </div>
      <div id="questionContainer" class="mt-3">
        <h2 id="question"></h2>
      </div>
    </div>
    <div id="playersContainer" class="text-center mt-5">
    </div>
    <div id="resultsContainer" class="text-center mt-3" style="display: none;">
      <div id="resultMessageContainer">
        <h3 id="resultMessage"></h3>
      </div>
      <div class="d-flex justify-content-center align-items-center">
        <button id="nextQuestionBtn" class="btn btn-primary mt-3">Prosegui al prossimo turno</button>
      </div>
    </div>
    <div id="gameOverMessage" class="text-center mt-5" style="display: none;">
      <h2>Classifica</h2>
      <div id="finalResultsContainer">
      </div>
    </div>
  </div>
}

export default Game;