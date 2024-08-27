import { useSession } from '../../contexts/SessionContext';
import { useNavigate } from 'react-router-dom';
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
  'https://avatar.iran.liara.run/public/job/chef/female',
  'https://avatar.iran.liara.run/public/job/teacher/female',
  'https://avatar.iran.liara.run/public/job/farmer/male',
  'https://avatar.iran.liara.run/public/job/designer/female',
];


const Login: React.FC = () => {
  const { currentPlayer, setCurrentPlayer, currentPlayerImage, setCurrentPlayerImage } = useSession();
  const navigate = useNavigate();
  const { setActiveIndex } = useNavbar();

  useEffect(() => {
    setActiveIndex(4);
  }, [setActiveIndex]);

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
      <div className="mb-4 w-100">
        <h2 className="h5 text-center">Username</h2>
        <input
          type="text"
          value={currentPlayer}
          onChange={(e) => setCurrentPlayer(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-4 w-100 text-center">
        <h2 className="h5">Profile picture:</h2>
        <div className="container">
          <div className="row">
            {images.map((image, index) => (
              <div key={index} className="col-3 mb-3 d-flex justify-content-center">
                <img
                  src={image}
                  alt={`Profile ${index + 1}`}
                  className={`img-thumbnail rounded-circle ${currentPlayerImage === image ? 'border-primary' : ''}`}
                  onClick={() => handleImageSelect(image)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary w-100"
        onClick={handleDoneClick}
      >
        Done
      </button>
      <Navbar />
    </div>
  );
};

export default Login;
