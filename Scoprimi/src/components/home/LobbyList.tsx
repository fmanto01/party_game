import { Game } from '../../../../Server/src/data/Game.ts';

interface LobbyListProps {
  lobbies: Game[];
  onJoin: (lobbyCode: string, playerName: string) => void;
  playerName: string;
}

const LobbyList: React.FC<LobbyListProps> = ({ lobbies, onJoin, playerName }) => (
  <table id="lobbiesList" className="table table-hover">
    <tbody>
      {lobbies.map((lobby) => (
        <tr
          key={lobby.lobbyCode}
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
      ))}
    </tbody>
  </table>
);

export default LobbyList;
