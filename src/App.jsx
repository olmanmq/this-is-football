import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Standings from './pages/Standings'
import Teams from './pages/Teams'
import Updater from './pages/Updater'
import RankingFifa from './pages/RankingFifa'
import Players from './pages/Players'



const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/Standings/:leagueId', element: <Standings /> },
  { path: '/Teams', element: <Teams /> },
  { path: '/Updater', element: <Updater /> },
  { path: '/RankingFifa', element: <RankingFifa /> },
  { path: '/Players/:leagueId/:playerId', element: <Players /> },

]

const router = createBrowserRouter(routes);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App
