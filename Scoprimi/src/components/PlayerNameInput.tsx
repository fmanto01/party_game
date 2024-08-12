interface PlayerNameInputProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
}

const PlayerNameInput: React.FC<PlayerNameInputProps> = ({ playerName, onPlayerNameChange }) => {
  return (
    <div className="form-group">
      <input
        type="text"
        id="playerNameInput"
        className="form-control mb-3"
        placeholder="Inserisci il tuo nome"
        value={playerName}
        onChange={(e) => onPlayerNameChange(e.target.value)}
      />
    </div>
  );
};

export default PlayerNameInput;