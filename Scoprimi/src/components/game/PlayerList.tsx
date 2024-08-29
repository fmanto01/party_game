import React from 'react';

interface PlayerListProps {
  players: string[];
  images: string[];
  onVote: (player: string) => void;
  disabled: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, images, onVote, disabled }) => (
  <div id="playersContainer" className="image-row">
    {players.map(player => (
      <button
        key={player}
        className="image-column"
        onClick={() => onVote(player)}
        disabled={disabled}
      >
        <img
          src={images[player]}
          className={'image-thumbnail'}
        />
      </button>
    ))}
  </div>
);

export default PlayerList;
