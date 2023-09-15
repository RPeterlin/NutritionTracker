import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/general.css';

// Pages
import Error from '../pages/Error';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import AddMeal from '../pages/AddMeal';
import TodayList from '../pages/TodayList';
import Dashboard from '../pages/Dashboard';

// User related pages
import Signup, {action as signupAction} from '../pages/user_related/Signup';
import Login, {loader as loginLoader, action as loginAction} from '../pages/user_related/Login';
import Profile, {loader as profileLoader, action as profileAction} from '../pages/user_related/Profile';
import ForgotPassword, {action as forgotAction} from '../pages/user_related/ForgotPassword';


// Components
import ProtectedRoute, {loader as protectedLoader} from './ProtectedRoute';
import Layout from './Layout';



function App() {
  const {
    signup, 
    login, 
    handleUpdateEmail, 
    handleUpdatePassword,
    resetPassword,
  } = useAuth();

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>

      <Route 
        index 
        element={<Home/>} 
      />
      <Route 
        path='/signup' 
        element={<Signup />} 
        action={async ({ request }) => await signupAction(request, signup)}
      />
      <Route 
        path='/login' 
        element={<Login />} 
        loader={loginLoader}
        action={async ({ request }) => await loginAction(request, login)}
      />
      <Route
        path='/password-reset'
        element={<ForgotPassword />}
        action={async ({ request }) => await forgotAction(request, resetPassword)}
      />

      <Route element={<ProtectedRoute />} loader={protectedLoader}>
        <Route 
          path='/profile' 
          element={<Profile />} 
          loader={profileLoader}
          action={async ({ request }) => await profileAction(request, handleUpdateEmail, handleUpdatePassword)}
        />
        <Route 
          path='/addMeal' 
          element={<AddMeal />} 
        />
        <Route 
          path='/today-list' 
          element={<TodayList />} 
        />
        <Route 
          path='/dashboard'
          element={<Dashboard />}
        />
      </Route>


      <Route path='*' element={<NotFound/>}/>
    </Route>
  ));

  return (
    <RouterProvider router={router}/>
  );
}


export default App;