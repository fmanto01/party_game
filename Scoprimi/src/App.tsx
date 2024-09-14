import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Lobby from './components/lobby/Lobby';
import Game from './components/game/Game';
import { SessionProvider } from './contexts/SessionContext';
import ProtectedRoute from './components/ProtectedRoutes';
import ErrorPage from './components/ErrorPage';
import FinalResults from './components/finalresults/FinalResults';
import Login from './components/login/Login';
import { useEffect, useState } from 'react';
import { webServerBaseUrl } from './ts/socketInit';
import Loader from './components/Loader';
import SocketListener from './components/SocketListener';
import JoinLobbyWithShare from './components/JoinLobbyWithShare/JoinLobbyWithShare';

const App = () => {
  const [serviceUp, setServiceUp] = useState(null); // null: loading, true: up, false: down

  useEffect(() => {
    const checkServiceStatus = async () => {
      try {
        const response = await fetch(webServerBaseUrl + '/api/status');
        setServiceUp(response.ok);
      } catch (error) {
        console.error('Error checking service status:', error);
        setServiceUp(false);
      }
    };

    checkServiceStatus();
  }, []);

  if (serviceUp === null) {
    return (
      <div className='center'>
        <Loader />
        <p>Bro i server sono scarsi, dammi il tempo...</p>
      </div>
    );
  }

  if (!serviceUp) {
    return <div id="loader">Service is Down. Please try again later.</div>;
  }

  return (
    <SessionProvider>
      {/* Questo era qua per github pages */}
      {/* <Router basename="/party_game/"> */}
      <Router>
        <SocketListener />
        <Routes>
          <Route path="" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<ProtectedRoute component={Lobby} />} />
          <Route path="/game" element={<ProtectedRoute component={Game} />} />
          <Route path="/final-results" element={<FinalResults />} />
          <Route path="/join/:lobbyCode" element={<JoinLobbyWithShare />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
