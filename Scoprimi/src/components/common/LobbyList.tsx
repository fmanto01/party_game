import React from 'react';
import { Game } from '../../../../Server/src/data/Game.ts';
import LobbyRow from './SingleLobby.tsx'; // Import the LobbyRow component

interface LobbyListProps {
  lobbies: Game[];
  onJoin: (lobbyCode: string) => void;
}

const LobbyList: React.FC<LobbyListProps> = ({ lobbies, onJoin }) => (
  <table id="lobbiesList" className="table table-hover">
    <tbody>
      {lobbies.map((lobby) => (
        <LobbyRow
          lobby={lobby}
          onJoin={onJoin}
        />
      ))}
    </tbody>
  </table>
);

export default LobbyList;
