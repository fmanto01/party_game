import React, { useState, useEffect } from 'react';

interface PlayerListProps {
  players: string[];
  images: string[];
  onVote: (player: string) => void;
  disabled: boolean;
  resetSelection: boolean;
  playersWhoVoted: string[];
}

const PlayerList: React.FC<PlayerListProps> = ({ players, images, onVote, disabled, resetSelection, playersWhoVoted }) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  useEffect(() => {
    if (resetSelection) {
      setSelectedPlayer(null); // Resetta la selezione quando `resetSelection` è vero
    }
  }, [resetSelection]);

  const handlePlayerClick = (player: string) => {
    if (!disabled) {
      setSelectedPlayer(player);
      onVote(player);
    }
  };

  return (
    <div id="playersContainer" className="image-row">
      {players.map(player => (
        <div
          key={player}
          className={'player-image-card'}
        >
          <div
            className="image-column"
            onClick={() => handlePlayerClick(player)}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
          >
            <img
              src={images[player]}
              className={`image-thumbnail ${selectedPlayer === player ? 'selected' : ''}`}
              alt={`Image of ${player}`}
              style={{ filter: (disabled && !playersWhoVoted.includes(player)) ? 'grayscale(100%)' : 'none' }}
            />

          </div>
          <p>{player}</p>
        </div>
      ))}
    </div>
  );
};

export default PlayerList;
