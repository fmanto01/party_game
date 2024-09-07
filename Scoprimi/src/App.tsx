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
import { useEffect, useState } from 'react';
import { webServerBaseUrl } from './ts/socketInit';
import NewGame from './components/newGame/NewGame';
import SearchGame from './components/search/SearchGame';
import Loader from './components/Loader';

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
      <Router basename="/party_game/">
        <SocketListener />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/lobby" element={<ProtectedRoute component={Lobby} />} />
          <Route path="/game" element={<ProtectedRoute component={Game} />} />
          <Route path="/new-game" element={<NewGame />} />
          <Route path="/search-game" element={<SearchGame />} />
          <Route path="/final-results" element={<FinalResults />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </Router>
    </SessionProvider>
  );
};

export default App;
