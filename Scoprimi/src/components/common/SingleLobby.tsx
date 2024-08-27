import React from 'react';
import { Game } from '../../../../Server/src/data/Game.ts';

interface LobbyRowProps {
  lobby: Game;
  onJoin: (lobbyCode: string, playerName: string) => void;
  playerName: string;
}

const LobbyRow: React.FC<LobbyRowProps> = ({ lobby, onJoin, playerName }) => (
  <tr
    onClick={() => !lobby.isGameStarted && onJoin(lobby.lobbyCode, playerName)}
    className={`lobby-row ${lobby.isGameStarted ? 'disabled' : ''}`}
  >
    <td>
      <span
        className={`status-indicator ${lobby.isGameStarted ? 'started' : 'waiting'}`}
      ></span>
    </td>
    <td>{lobby.lobbyCode}</td>
    <td>{lobby.players.length}</td>
  </tr>
);

export default LobbyRow;
