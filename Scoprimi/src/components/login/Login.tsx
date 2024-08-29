import { useSession } from '../../contexts/SessionContext';
import Navbar from '../common/Navbar';
import { useNavbar } from '../../contexts/NavbarContext';
import { useEffect } from 'react';

const images = [
  'https://avatar.iran.liara.run/public/job/police/male',
  'https://avatar.iran.liara.run/public/job/doctor/female',
  'https://avatar.iran.liara.run/public/job/chef/male',
  'https://avatar.iran.liara.run/public/job/firefighters/female',
  'https://avatar.iran.liara.run/public/job/teacher/male',
  'https://avatar.iran.liara.run/public/job/firefighters/male',
  'https://avatar.iran.liara.run/public/job/farmer/female',
  'https://avatar.iran.liara.run/public/job/doctor/male',
  'https://avatar.iran.liara.run/public/job/police/female',
  'https://avatar.iran.liara.run/public/job/lawyer/female',
  'https://avatar.iran.liara.run/public/job/operator/female',
  'https://avatar.iran.liara.run/public/job/astronomer/male',
  // 'https://avatar.iran.liara.run/public/job/chef/female',
  // 'https://avatar.iran.liara.run/public/job/farmer/male',
  // 'https://avatar.iran.liara.run/public/job/designer/female',
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
