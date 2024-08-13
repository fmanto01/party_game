import React from 'react';

interface PlayerListProps {
  players: string[];
  onVote: (player: string) => void;
  disabled: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onVote, disabled }) => (
  <div id="playersContainer" className="text-center mt-5">
    <div className="d-flex flex-column align-items-center">
      {players.map(player => (
        <button
          key={player}
          className="btn btn-primary m-2 player-button"
          style={{ width: '100%', maxWidth: '400px' }}
          onClick={() => onVote(player)}
          disabled={disabled}
        >
          {player}
        </button>
      ))}
    </div>
  </div>
);

export default PlayerList;
