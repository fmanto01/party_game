import React from 'react';
import { Game } from '../../../../Server/src/data/Game.ts';
import LobbyRow from './SingleLobby.tsx'; // Import the LobbyRow component

interface LobbyListProps {
  lobbies: Game[];
  onJoin: (lobbyCode: string) => void;
}

const LobbyList: React.FC<LobbyListProps> = ({ lobbies, onJoin }) => (
  <table className="table table-games table-hover">
    <tbody>
      {
        lobbies.map((lobby) => (
          <LobbyRow
            key={lobby.lobbyCode}
            lobby={lobby}
            onJoin={onJoin}
          />
        ))
      }
    </tbody >
  </table >
);

export default LobbyList;
