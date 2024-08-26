import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const handleButtonClick = (index: number) => {
    setActiveIndex(index);
    const navdirections = [
      '/',
      '/lobby',
      '/new-game',
      '/search-game',
      '/login',
    ];
    navigate(navdirections[index], { replace: true });
  };

  return (
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
  );
};

export default Navbar;
