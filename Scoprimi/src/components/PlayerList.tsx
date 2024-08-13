import React from 'react';

interface PlayerListProps {
  players: string[];
  onVote: (player: string) => void;
  disabled: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, onVote, disabled }) => (
  <div id="playersContainer" className="text-center mt-5">
    {players.map(player => (
      <button
        key={player}
        className="btn btn-primary m-2 player-button"
        onClick={() => onVote(player)}
        disabled={disabled}
      >
        {player}
      </button>
    ))}
  </div>
);

export default PlayerList;
