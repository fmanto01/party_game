import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../contexts/SessionContext';
import { socket } from '../../ts/socketInit';
import * as c from '../../../../Server/src/socketConsts.js';
import { useNavbar } from '../../contexts/NavbarContext';
import Modal from './Modal'; // Import the Modal component

const Navbar = () => {
  const navigate = useNavigate();
  const { activeIndex } = useNavbar();
  const [pendingNavIndex, setPendingNavIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { currentLobby, currentPlayer, setCurrentLobby } = useSession();

  const exitLobbyPage = () => {
    socket.emit(c.EXIT_LOBBY, { currentPlayer, currentLobby });
    setCurrentLobby(undefined);
  };

  const handleButtonClick = (index: number) => {
    if (activeIndex === 1 && index !== 1) {
      setPendingNavIndex(index);
      setShowModal(true);
    } else {
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
      exitLobbyPage();
      const navdirections = [
        '/',
        '/lobby',
        '/new-game',
        '/search-game',
        '/login',
      ];
      navigate(navdirections[pendingNavIndex], { replace: true });
      setPendingNavIndex(null);
    }
    setShowModal(false);
  };

  const handleCancelLeave = () => {
    setShowModal(false);
    setPendingNavIndex(null);
  };

  return (
    <>
      <nav className="navbar navbar-light bg-dark">
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

      <Modal
        show={showModal}
        onConfirm={handleConfirmLeave}
        onCancel={handleCancelLeave}
      />
    </>
  );
};

export default Navbar;
