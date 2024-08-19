import { useSession } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

const images = [
  'https://via.placeholder.com/150/0000FF/808080?text=Profile+1',
  'https://via.placeholder.com/150/FF0000/FFFFFF?text=Profile+2',
  'https://via.placeholder.com/150/00FF00/000000?text=Profile+3',
  'https://via.placeholder.com/150/FFFF00/0000FF?text=Profile+4',
];

const Login: React.FC = () => {
  const { currentPlayer, setCurrentPlayer, currentPlayerImage, setCurrentPlayerImage } = useSession();
  const navigate = useNavigate();

  const handleImageSelect = (image: string) => {
    setCurrentPlayerImage(image);
  };

  const handleDoneClick = () => {
    if (!currentPlayerImage || !currentPlayer) {
      alert('Please select an image and enter a username.');
    }
    navigate('/');
  };

  return (
    <div className="container d-flex flex-column align-items-center py-5">
      <h1 className="mb-4">ScopriMi</h1>
      <div className="mb-4 w-100 text-center">
        <h2 className="h5">Select Profile Image</h2>
        <div className="d-flex justify-content-center flex-wrap gap-3">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Profile ${index + 1}`}
              className={`img-thumbnail rounded-circle ${currentPlayerImage === image ? 'border-primary' : ''}`}
              style={{
                cursor: 'pointer',
                width: '80px',
                height: '80px',
              }}
              onClick={() => handleImageSelect(image)}
            />
          ))}
        </div>
      </div>
      <div className="mb-4 w-100">
        <h2 className="h5 text-center">Enter Username</h2>
        <input
          type="text"
          value={currentPlayer}
          onChange={(e) => setCurrentPlayer(e.target.value)}
          className="form-control"
          placeholder="Enter your username"
        />
      </div>
      <button
        className="btn btn-primary w-100"
        onClick={handleDoneClick}
      >
        Done
      </button>
    </div>
  );
};

export default Login;
