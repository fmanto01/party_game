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
  // TODO inizio a proporre la classe Player
  const [players, setPlayers] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
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
    const storedImages = sessionStorage.getItem('images');

    if (storedQuestion && storedPlayers && storedImages) {
      setQuestion(storedQuestion);
      setPlayers(JSON.parse(storedPlayers));
      setIsTimerActive(true);
      setImages(JSON.parse(storedImages));
    } else {
      socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: currentLobby, playerName: currentPlayer });
    }

    socket.on(c.SEND_QUESTION, ({ question, players, images }: QuestionData) => {
      sessionStorage.setItem('currentQuestion', question);
      sessionStorage.setItem('players', JSON.stringify(players));
      sessionStorage.setItem('images', JSON.stringify(images));
      setClicked(false);
      setIsTimerActive(true);
      setQuestion(question);
      setPlayers(players);
      setImages(images);
      setShowResults(false);
    });

    socket.on(c.SHOW_RESULTS, (data: { resultMessage: string, voteRecap: string }) => {
      console.log('Recap dei voti: ', data.voteRecap);
      const formattedVoteRecap = data.voteRecap.replace(/\n/g, '<br />');
      const formattedResultMessage = data.resultMessage + '<br />' + formattedVoteRecap;
      setResultMessage(formattedResultMessage);
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
    <div className="paginator">
      <div className="">
        {!gameOver && (
          <>
            <Question question={question} />
            <div className='inline'>
              <p>Scegli un giocatore</p>
              <Timer duration={25} onTimeUp={handleTimeUp} isActive={isTimerActive} />
            </div>
          </>
        )}
      </div>
      {/* Blocco player */}
      {!gameOver && (
        <div className='elegant-background image-container'>
          <PlayerList players={players} images={images} onVote={handleVote} disabled={clicked} />
        </div>
      )}
      {showResults && (
        <Results resultMessage={resultMessage} onNextQuestion={handleNextQuestion} />
      )}
    </div>
  );
};

export default Game;
