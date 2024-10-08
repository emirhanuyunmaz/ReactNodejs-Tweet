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
import { UserContextProvider } from './context/userContext.jsx';
import UserProfile from './layout/UserProfile.jsx';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './store/reduxStore.js';


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
  {
    path: "/user/:id",
    element:<ProtectedRoute> <UserProfile/></ProtectedRoute>,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ReduxProvider store={store} >
    <UserContextProvider>
      <Navbar/>
      <RouterProvider router={router} />
    </UserContextProvider>
    </ReduxProvider>
  </StrictMode>,
)
