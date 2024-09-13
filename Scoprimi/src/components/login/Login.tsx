import { useSession } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';

const images = [
  'https://raw.githubusercontent.com/fmanto01/image-repo-scoprimi/main/images/profile_icon_1.png',
  'https://raw.githubusercontent.com/fmanto01/image-repo-scoprimi/main/images/profile_icon_2.png',
  'https://raw.githubusercontent.com/fmanto01/image-repo-scoprimi/main/images/profile_icon_3.png',
  'https://raw.githubusercontent.com/fmanto01/image-repo-scoprimi/main/images/profile_icon_4.png',
  'https://raw.githubusercontent.com/fmanto01/image-repo-scoprimi/main/images/profile_icon_5.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_6.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_7.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_8.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_15.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_18.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_28.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_32.png',
];


const Login: React.FC = () => {
  const { currentPlayer, setCurrentPlayer, currentPlayerImage, setCurrentPlayerImage } = useSession();
  const navigator = useNavigate();

  const handleImageSelect = (image: string) => {
    setCurrentPlayerImage(image);
  };

  const toHomePage = () => {
    navigator('/');
  };

  return (
    <>
      <div className="paginator">
        <h2>ScopriMi</h2>
        {/* Primo blocco */}
        <div className="elegant-background mt-3 form-floating">
          <div className='flex justify-content-end'>
            <i className="icon-input fa-solid fa-user"></i>
          </div>
          <input
            name="new-username"
            maxLength={8}
            type="text"
            value={currentPlayer || ''}
            onChange={(e) => setCurrentPlayer(e.target.value)}
            className="my-input fill-input my-bg-secondary"
            placeholder="Username..."
            id="floatingInput"
            autoComplete="off"
            required
          />
          <label className='my-label'>Username</label>
        </div>
        {/* Secondo blocco */}
        <div className="elegant-background image-container mt-3 fill">
          <div className="image-row">
            {images.map((image, index) => (
              <div key={index}
                className="image-column">
                <img
                  src={image}
                  alt={`Profile ${index + 1}`}
                  className={`image-thumbnail ${currentPlayerImage === image ? 'selected' : ''}`}
                  onClick={() => handleImageSelect(image)} />
              </div>
            ))}
          </div>
        </div>
        <button
          className={`my-btn mt-3 ${!currentPlayer || !currentPlayerImage ? 'my-bg-disabled' : 'my-bg-tertiary'}`}
          onClick={toHomePage}
          disabled={!currentPlayer || !currentPlayerImage}
        >
          Crea utente
        </button>
      </div>
    </>
  );
};

export default Login;
