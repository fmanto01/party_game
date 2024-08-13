import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.tsx';
import Lobby from './components/lobby.tsx';
import Game from './components/game.tsx';
import { SessionProvider } from './contexts/SessionContext.tsx';

const App = () => (
  <Router>
    <Routes>
      <SessionProvider>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </SessionProvider>
    </Routes>
  </Router>
);

export default App;
