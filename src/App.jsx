import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import Leagues from './pages/Leagues'

const routes = [
  { path: '/', element: <HomePage /> },
  { path: '/Leagues', element: <Leagues /> },
]

const router = createBrowserRouter(routes);

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App
