import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Game from '../public/html/game.jsx';
import Lobby from '../public/html/lobby.jsx';
import Home from '../public/html/home.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
      </Routes>
    </Router>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);
