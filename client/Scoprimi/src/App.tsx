import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import Game from './components/game.tsx';
import Lobby from './components/lobby.jsx';
import Home from './components/home.jsx';

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
