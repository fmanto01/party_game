import React, { useEffect, useState } from 'react';
import * as c from '../../../Server/src/socketConsts';
import { QuestionData, FinalResultsData } from '../ts/types';
import { socket } from '../ts/socketInit';
import Timer from './timer';
import Question from './Question';
import PlayerList from './PlayerList';
import Results from './Results';
import FinalResults from './FinalResults';
import { useSession } from '../contexts/SessionContext';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [finalResults, setFinalResults] = useState<FinalResultsData>();

  const [clicked, setClicked] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const { currentLobby, currentPlayer } = useSession();

  useEffect(() => {
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: currentLobby, playerName: currentPlayer });

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
  }, [currentLobby, currentPlayer]);

  const handleVote = (player: string) => {
    if (clicked) {
      console.log('Hai già votato!');
      return;
    }
    setClicked(true);
    setIsTimerActive(false);
    socket.emit(c.VOTE, { lobbyCode: currentLobby, voter: currentPlayer, vote: player });
  };

  const handleNextQuestion = () => {
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: currentLobby, playerName: currentPlayer });
  };

  const handleTimeUp = () => {
    if (!clicked) {
      socket.emit(c.VOTE, { lobbyCode: currentLobby, voter: currentPlayer, vote: '' });
    }
    setIsTimerActive(false);
  };

  return (
    <div className="container mt-5">
      <div className="top-container text-center mt-3">
        {!gameOver && (
          <>
            <Timer duration={10} onTimeUp={handleTimeUp} isActive={isTimerActive} />
            <Question question={question} />
          </>
        )}
      </div>
      {!gameOver && (
        <PlayerList players={players} onVote={handleVote} disabled={clicked} />
      )}
      {showResults && (
        <Results resultMessage={resultMessage} onNextQuestion={handleNextQuestion} />
      )}
      {gameOver && finalResults && (
        <FinalResults finalResults={finalResults} />
      )}
    </div>
  );
};

export default Game;
