import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Game from '../public/html/game.jsx';
import Lobby from '../public/html/lobby.jsx';
import Home from '../public/html/home.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Home />}>
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game" element={<Game />} />
    </Route>
  )
)

function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
