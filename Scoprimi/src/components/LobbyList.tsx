import { Game } from '../../../Server/src/data/Game.ts';

interface LobbyListProps {
  lobbies: Game[];
  onJoin: (lobbyCode: string, playerName: string) => void;
  playerName: string;
}

const LobbyList: React.FC<LobbyListProps> = ({ lobbies, onJoin, playerName }) => (
  <table id="lobbiesList" className="table table-bordered">
    <thead>
      <tr>
        <th>Codice Lobby</th>
        <th>Num Giocatori</th>
        <th>Status</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {lobbies.map((lobby) => (
        <tr key={lobby.lobbyCode}>
          <td>{lobby.lobbyCode}</td>
          <td>{lobby.players.length}</td>
          <td>{lobby.isGameStarted ? 'Iniziato' : 'In attesa'}</td>
          <td>
            {!lobby.isGameStarted && (
              <button className="btn btn-success" onClick={() => onJoin(lobby.lobbyCode, playerName)}>
                Join
              </button>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default LobbyList;
