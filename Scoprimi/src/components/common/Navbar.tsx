import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { socket } from '../../ts/socketInit';
import * as c from '../../../../Server/src/socketConsts.js';
import { useNavbar } from '../../contexts/NavbarContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { activeIndex, setActiveIndex } = useNavbar();
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { currentLobby, currentPlayer, setCurrentLobby } = useSession();

  const exitLobbyPage = () => {
    socket.emit(c.EXIT_LOBBY, { currentPlayer, currentLobby });
    setCurrentLobby(undefined);
  };

  const handleButtonClick = (index: number) => {
    if (activeIndex === 1 && index !== 1) {
      // User is trying to navigate away from the lobby, show the confirmation modal
      setPendingNavIndex(index);
      setShowModal(true);
    } else {
      // Navigate to the selected route directly
      setActiveIndex(index);
      const navdirections = [
        '/',
        '/lobby',
        '/new-game',
        '/search-game',
        '/login',
      ];
      navigate(navdirections[index], { replace: true });
    }
  };

  const handleConfirmLeave = () => {
    if (pendingNavIndex !== null) {
      // User confirmed to leave the lobby
      exitLobbyPage();
      setActiveIndex(pendingNavIndex);
      const navdirections = [
        '/',
        '/lobby',
        '/new-game',
        '/search-game',
        '/login',
      ];
      navigate(navdirections[pendingNavIndex], { replace: true });
      setPendingNavIndex(null); // Clear pending index
    }
    setShowModal(false); // Hide the modal
  };

  const handleCancelLeave = () => {
    // User canceled, close the modal and stay in the lobby
    setShowModal(false);
    setPendingNavIndex(null);
  };

  return (
    <>
      <nav className="navbar fixed-bottom navbar-light bg-dark">
        <div className="container-fluid justify-content-around">
          <button
            className={`btn btn-dark ${activeIndex === 0 ? 'active' : ''}`}
            onClick={() => handleButtonClick(0)}
          >
            <i className="fas fa-home"></i>
          </button>
          <button
            className={`btn btn-dark ${activeIndex === 1 ? 'active' : ''}`}
            onClick={() => handleButtonClick(1)}
          >
            <i className="fas fa-list"></i>
          </button>
          <button
            className={`btn btn-dark ${activeIndex === 2 ? 'active' : ''}`}
            onClick={() => handleButtonClick(2)}
          >
            <i className="fas fa-plus"></i>
          </button>
          <button
            className={`btn btn-dark ${activeIndex === 3 ? 'active' : ''}`}
            onClick={() => handleButtonClick(3)}
          >
            <i className="fas fa-search"></i>
          </button>
          <button
            className={`btn btn-dark ${activeIndex === 4 ? 'active' : ''}`}
            onClick={() => handleButtonClick(4)}
          >
            <i className="fas fa-user"></i>
          </button>
        </div>
      </nav>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h5>Confirm Exit</h5>
            <p>Are you sure you want to leave the lobby?</p>
            <button className="btn btn-danger" onClick={handleConfirmLeave}>
              Yes, leave
            </button>
            <button className="btn btn-secondary" onClick={handleCancelLeave}>
              No, stay
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
