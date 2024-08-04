import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Game from './components/game.tsx';
import Lobby from './components/lobby.js';
import Home from './components/home.js';

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
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
