import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Standings from './pages/Standings'
import Teams from './pages/Teams'
import Updater from './pages/Updater'



const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/Standings/:leagueId', element: <Standings /> },
  { path: '/Teams', element: <Teams /> },
  { path: '/Updater', element: <Updater /> },
]

const router = createBrowserRouter(routes);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App
