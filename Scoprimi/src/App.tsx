import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home.tsx';
import Lobby from './components/lobby.tsx';
import Game from './components/game.tsx';
import { SessionProvider } from './contexts/SessionContext.tsx';
import ProtectedRoute from './components/ProtectedRoutes.tsx';
import ErrorPage from './components/ErrorPage.tsx';


const App = () => (
  <SessionProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/lobby" element={<ProtectedRoute component={Lobby} />}
        />
        <Route
          path="/game" element={<ProtectedRoute component={Game} />}
        />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  </SessionProvider >
);

export default App;
