import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home.tsx';
import Lobby from './components/lobby/Lobby.tsx';
import Game from './components/game/Game.tsx';
import { SessionProvider } from './contexts/SessionContext.tsx';
import ProtectedRoute from './components/ProtectedRoutes.tsx';
import ErrorPage from './components/ErrorPage.tsx';
import FinalResults from './components/finalresults/FinalResults.tsx';
import Login from './components/login/Login.tsx';


const App = () => (
  <SessionProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/lobby" element={<ProtectedRoute component={Lobby} />}
        />
        <Route
          path="/game" element={<ProtectedRoute component={Game} />}
        />
        <Route path="/final-results" element={<FinalResults />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  </SessionProvider >
);

export default App;
