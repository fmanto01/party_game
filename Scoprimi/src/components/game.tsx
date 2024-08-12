import React, { useEffect, useState } from 'react';
import * as c from '../../../Server/src/socketConsts';
import { QuestionData, FinalResultsData } from '../ts/types';
import { socket } from '../ts/socketInit';
import Timer from './timer';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [finalResults, setFinalResults] = useState<FinalResultsData>();

  const [clicked, setClicked] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const lobbyCode = params.get('lobbyCode') || '';
  const playerName = params.get('playerName') || '';

  useEffect(() => {
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode, playerName });

    socket.on(c.SEND_QUESTION, ({ question, players }: QuestionData) => {
      setClicked(false);
      setIsTimerActive(true);
      setQuestion(question);
      setPlayers(players);
      setShowResults(false);
    });

    socket.on(c.SHOW_RESULTS, (data: { resultMessage: string }) => {
      setResultMessage(data.resultMessage);
      setShowResults(true);
      setIsTimerActive(false);
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

    return () => {
      socket.off(c.SEND_QUESTION);
      socket.off(c.SHOW_RESULTS);
      socket.off(c.RESULT_MESSAGE);
      socket.off(c.GAME_OVER);
      socket.off(c.FINAL_RESULTS);
    };
  }, [lobbyCode, playerName]);

  const handleVote = (player: string) => {
    if (clicked) {
      console.log('Hai già votato!');
      return;
    }
    setClicked(true);
    setIsTimerActive(false);
    socket.emit(c.VOTE, { lobbyCode, voter: playerName, vote: player });
  };

  const handleNextQuestion = () => {
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode, playerName });
  };

  const handleTimeUp = () => {
    if (!clicked) {
      socket.emit(c.VOTE, { lobbyCode, voter: playerName, vote: '' });
    }
    setIsTimerActive(false);
  };

  return (
    <div className="container mt-5">
      <div className="top-container text-center mt-3">
        {!gameOver && (
          <div id="timerContainer">
            <Timer duration={10} onTimeUp={handleTimeUp} isActive={isTimerActive} />
          </div>
        )}
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