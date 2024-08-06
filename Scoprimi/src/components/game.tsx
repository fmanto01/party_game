import React, { useEffect, useState, useRef } from 'react';

import * as c from '../../../server/src/socketConsts';
import { QuestionData, ResultsData, FinalResultsData } from '../ts/types';
import { socket } from '../ts/socketInit';

const Game: React.FC = () => {
  const [timer, setTimer] = useState<number>(10);
  const [question, setQuestion] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [finalResults, setFinalResults] = useState<FinalResultsData>();

  const [clicked, setClicked] = useState<boolean>(false);
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const lobbyCode = params.get('lobbyCode') || '';
  const playerName = params.get('playerName') || '';

  const timerRef = useRef<number>(10);

  useEffect(() => {

    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode, playerName });

    socket.on(c.SEND_QUESTION, ({ question, players }: QuestionData) => {
      setClicked(false);
      startTimer(10);
      setQuestion(question);
      setPlayers(players);
      setShowResults(false);
    });


    socket.on(c.SHOW_RESULTS, ({ resultMessage, players }: ResultsData) => {
      setResultMessage(resultMessage);
      setShowResults(true);
    });

    socket.on(c.RESULT_MESSAGE, (message: string) => {
      setResultMessage(message);
    });

    socket.on(c.GAME_OVER, () => {
      setGameOver(true);
      setQuestion('');
      setPlayers([]);
      setShowResults(false);
    });

    socket.on(c.FINAL_RESULTS, (playerScores: FinalResultsData) => {
      setFinalResults(playerScores);
    });

  }, []);

  const startTimer = (duration: number) => {
    setTimer(duration);
    timerRef.current = window.setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          if (!clicked) {
            socket.emit(c.VOTE, { lobbyCode: lobbyCode, voter: playerName, vote: '' });
            clearInterval(timerRef.current!);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVote = (player: string) => {
    if (clicked) {
      console.log('Hai già votato!');
      return;
    }
    setClicked(true);
    clearInterval(timerRef.current!);
    socket.emit(c.VOTE, { lobbyCode: lobbyCode, voter: playerName, vote: player });
  };

  const handleNextQuestion = () => {
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: lobbyCode, playerName: playerName });
  };

  return (
    <div className="container mt-5">
      <div className="top-container text-center mt-3">
        {!gameOver &&
          <div id="timerContainer">
            <h3>⌛: <span id="timer">{timer}</span> secondi</h3>
          </div>
        }
        <div id="questionContainer" className="mt-3">
          <h2 id="question">{question}</h2>
        </div>
      </div>
      <div id="playersContainer" className="text-center mt-5">
        {players.map(player => (
          <button
            key={player}
            className="btn btn-primary m-2 player-button"
            onClick={() => handleVote(player)}
          >
            {player}
          </button>
        ))}
      </div>
      {showResults && (
        <div id="resultsContainer" className="text-center mt-3">
          <div id="resultMessageContainer">
            <h3 id="resultMessage">{resultMessage}</h3>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <button id="nextQuestionBtn" className="btn btn-primary mt-3" onClick={handleNextQuestion}>
              Prosegui al prossimo turno
            </button>
          </div>
        </div>
      )}
      {gameOver && finalResults && (
        <div id="gameOverMessage" className="text-center mt-5">
          <h2>Classifica</h2>
          <div id="finalResultsContainer">
            <table className="table">
              <thead>
                <tr>
                  <th>Posizione</th>
                  <th>Giocatore</th>
                  <th>Punti</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(finalResults)
                  .sort((a, b) => b[1] - a[1])
                  .map(([player, score], index) => (
                    <tr key={player}>
                      <td>
                        {index + 1} {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                      </td>
                      <td>{player}</td>
                      <td>{score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game;
