import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.tsx';
import Lobby from './components/lobby.tsx';
import Game from './components/game.tsx';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
};

export default App
