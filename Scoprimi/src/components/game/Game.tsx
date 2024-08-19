import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts';
import { QuestionData, PlayerImages, PlayerScores, FinalResultData } from '../../ts/types';
import { socket } from '../../ts/socketInit';
import Timer from './Timer';
import Question from './Question';
import PlayerList from './PlayerList';
import Results from './Results';
import { useSession } from '../../contexts/SessionContext';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  const [players, setPlayers] = useState<string[]>([]);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [clicked, setClicked] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const { currentLobby, currentPlayer, setCurrentPlayer } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    const storedQuestion = sessionStorage.getItem('currentQuestion');
    const storedPlayers = sessionStorage.getItem('players');

    if (storedQuestion && storedPlayers) {
      setQuestion(storedQuestion);
      setPlayers(JSON.parse(storedPlayers));
      setIsTimerActive(true);
    } else {
      socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: currentLobby, playerName: currentPlayer });
    }

    socket.on(c.SEND_QUESTION, ({ question, players }: QuestionData) => {
      sessionStorage.setItem('currentQuestion', question);
      sessionStorage.setItem('players', JSON.stringify(players));
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

    socket.on(c.GAME_OVER, (data: { playerScores: PlayerScores, playerImages: PlayerImages }) => {
      setGameOver(true);
      setQuestion('');
      setPlayers([]);
      setShowResults(false);
      socket.emit(c.LEAVE_ROOM, { playerName: currentPlayer, LobbyCode: currentLobby });

      // Naviga alla pagina dei risultati finali
      sessionStorage.removeItem('currentQuestion');
      sessionStorage.removeItem('players');
      sessionStorage.removeItem('currentLobby');
      const finalResults: FinalResultData = {};
      Object.keys(data.playerScores).forEach(playerName => {
        finalResults[playerName] = {
          score: data.playerScores[playerName],
          image: data.playerImages[playerName],
        };
      });
      console.log(finalResults);
      navigate('/final-results', { state: { finalResults } });
    });

    return () => {
      socket.off(c.SEND_QUESTION);
      socket.off(c.SHOW_RESULTS);
      socket.off(c.RESULT_MESSAGE);
      socket.off(c.GAME_OVER);
    };
  }, [currentLobby, currentPlayer, setCurrentPlayer, navigate]);

  const handleVote = (player: string) => {
    if (clicked) {
      console.log('Hai già votato!');
      return;
    }
    setClicked(true);
    setIsTimerActive(false);
    sessionStorage.removeItem('timeLeft');
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
    </div>
  );
};

export default Game;
