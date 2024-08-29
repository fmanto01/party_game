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
      <div className='player-image-card'>
        <div
          key={player}
          className="image-column"
          onClick={() => onVote(player)}
          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          <img
            src={images[player]}
            className="image-thumbnail"
            alt={`Image of ${player}`}
          />
        </div>
        <p>{player}</p>
      </div>
    ))}
  </div>
);

export default PlayerList;
