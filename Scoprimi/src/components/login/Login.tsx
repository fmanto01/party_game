import { useSession } from '../../contexts/SessionContext';
import Navbar from '../common/Navbar';
import { useNavbar } from '../../contexts/NavbarContext';
import { useEffect } from 'react';

const images = [
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_1.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_2.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_3.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_4.png',
  'https://cdn.jsdelivr.net/gh/alohe/avatars/png/memo_5.png',
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
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(4);
  }, [setActiveIndex]);

  const handleImageSelect = (image: string) => {
    setCurrentPlayerImage(image);
  };

  return (
    <>
      <div className="paginator navbar-page">
        <h2>ScopriMi</h2>
        {/* Primo blocco */}
        <div className="elegant-background">
          <p>Username</p>
          <input
            maxLength={8}
            type="text"
            value={currentPlayer}
            onChange={(e) => setCurrentPlayer(e.target.value)}
            className="my-input fill-input my-bg-secondary"
          />
        </div>
        {/* Secondo blocco */}
        <div className="elegant-background image-container mt-3">
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
      </div>
      <Navbar />
    </>
  );
};

export default Login;
