import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as c from '../../../../Server/src/socketConsts';
import { QuestionData, PlayerImages, PlayerScores, FinalResultData } from '../../ts/types';
import { socket } from '../../ts/socketInit';
import Timer from './Timer';
import Question from './Question';
import PlayerList from './PlayerList';
import { useSession } from '../../contexts/SessionContext';
import Results from './Results';

const Game: React.FC = () => {
  const [question, setQuestion] = useState<string>('');
  // TODO inizio a proporre la classe Player
  const [players, setPlayers] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [showResults, setShowResults] = useState<boolean>(false);
  // TODO Remove
  const [resultMessage, setResultMessage] = useState<string>('');
  // TODO Remove
  const [voteRecap, setVoteRecap] = useState<{ [key: string]: string }>({});
  const [gameOver, setGameOver] = useState<boolean>(false);

  const [clicked, setClicked] = useState<boolean>(false);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);

  const { currentLobby, currentPlayer, setCurrentPlayer, setCurrentLobby } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Sono pronto a ricevere', currentLobby, currentPlayer);
    socket.emit(c.READY_FOR_NEXT_QUESTION, { lobbyCode: currentLobby, playerName: currentPlayer });
  }, [currentLobby, currentPlayer]);

  useEffect(() => {
    socket.on(c.SEND_QUESTION, ({ question, players, images }: QuestionData) => {
      console.log('ecco la domanda');
      setClicked(false);
      setIsTimerActive(true);
      setQuestion(question);
      setPlayers(players);
      setImages(images);
      setShowResults(false);
    });

    socket.on(c.SHOW_RESULTS, (data: { resultMessage: string, voteRecap: { [key: string]: string } }) => {
      // TODO REMOVE
      setResultMessage(data.resultMessage);
      // TODO REMOVE
      setVoteRecap(data.voteRecap);
      setShowResults(true);
      setIsTimerActive(false);
    });


    socket.on(c.GAME_OVER, (data: { playerScores: PlayerScores, playerImages: PlayerImages }) => {
      setGameOver(true);
      setQuestion('');
      setPlayers([]);
      setShowResults(false);
      setCurrentLobby(undefined);
      socket.emit(c.LEAVE_ROOM, { playerName: currentPlayer, LobbyCode: currentLobby });

      // Naviga alla pagina dei risultati finali
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
  }, [currentLobby, currentPlayer, setCurrentPlayer, navigate, setCurrentLobby, resultMessage]);

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
        // TODO REMOVE
        <>
          <Results resultMessage={resultMessage} voteRecap={voteRecap} />
          <div className="d-flex justify-content-center align-items-center">
            <button
              id="nextQuestionBtn"
              className="my-btn my-bg-tertiary mt-3"
              onClick={handleNextQuestion}
            >
              Prosegui al prossimo turno
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
