import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Lobby from './components/lobby/Lobby';
import Game from './components/game/Game';
import { SessionProvider } from './contexts/SessionContext';
import ProtectedRoute from './components/ProtectedRoutes';
import ErrorPage from './components/ErrorPage';
import FinalResults from './components/finalresults/FinalResults';
import Login from './components/login/Login';
import SocketListener from './components/SocketListeners';

const App = () => (
  <SessionProvider>
    <Router basename="/party_game">
      <SocketListener />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lobby" element={<ProtectedRoute component={Lobby} />} />
        <Route path="/game" element={<ProtectedRoute component={Game} />} />
        <Route path="/final-results" element={<FinalResults />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  </SessionProvider>
);

export default App;
