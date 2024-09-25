import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Login from './layout/Login.jsx';
import Navbar from './components/Navbar.jsx';
import Signup from './layout/Signup.jsx';
import Tweet from './layout/Tweet.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import Profile from './layout/Profile.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/signup",
    element: <Signup/>,
  },
  {
    path: "/tweet",
    element:<ProtectedRoute> <Tweet/></ProtectedRoute>,
  },
  {
    path: "/profile",
    element:<ProtectedRoute> <Profile/></ProtectedRoute>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar/>
    <RouterProvider router={router} />
  </StrictMode>,
)
