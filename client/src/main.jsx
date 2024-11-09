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
import SingleTweet from './layout/SingleTweet.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TweetTagGroup from './layout/TweetTagGroup.jsx';
import UserTags from './layout/UserTags.jsx';
import Message from './layout/Message.jsx';


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
    path: "/message",
    element:<ProtectedRoute> <Message/></ProtectedRoute>,
  },
  {
    path: "/tweetTagGroup/:id",
    element:<ProtectedRoute> <TweetTagGroup/></ProtectedRoute>,
  },
  {
    path: "/tweet/:id",
    element:<ProtectedRoute> <SingleTweet/></ProtectedRoute>,
  },
  {
    path: "/userTag/:tag",
    element:<ProtectedRoute> <UserTags/></ProtectedRoute>,
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
    <ToastContainer />
    </ReduxProvider>
  </StrictMode>,
)
