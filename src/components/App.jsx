import React from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/general.css';

// Pages
import Error from '../pages/Error';
import NotFound from '../pages/NotFound';
import Home from '../pages/Home';
import AddMeal, { loader as addMealLoader} from '../pages/AddMeal';
import TodayList, { loader as todayLoader} from '../pages/TodayList';
import Dashboard, { loader as dashboardLoader } from '../pages/Dashboard';

// User related pages
import Signup, {loader as signupLoader, action as signupAction} from '../pages/user_related/Signup';
import Login, {loader as loginLoader, action as loginAction} from '../pages/user_related/Login';
import Profile, {loader as profileLoader, action as profileAction} from '../pages/user_related/Profile';
import ForgotPassword, {loader as forgotLoader, action as forgotAction} from '../pages/user_related/ForgotPassword';


// Components
import Layout from './Layout';
import { useData } from '../contexts/DataContext';


function App() {

  const {
    currentUser,
    signup, 
    login, 
    handleUpdateEmail, 
    handleUpdatePassword,
    resetPassword,
  } = useAuth();

  const {
    addUser,
  } = useData();


  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>

      <Route 
        index 
        element={<Home/>} 
      />
      <Route 
        path='/signup' 
        element={<Signup />} 
        loader={({ request }) => signupLoader(request, currentUser)}
        action={async ({ request }) => await signupAction(request, signup, addUser)}
      />
      <Route 
        path='/login' 
        element={<Login />} 
        loader={({ request }) => loginLoader(request, currentUser)}
        action={async ({ request }) => await loginAction(request, login)}
      />
      <Route
        path='/password-reset'
        element={<ForgotPassword />}
        loader={({ request }) => forgotLoader(request, currentUser)}
        action={async ({ request }) => await forgotAction(request, resetPassword)}
      />

      {/* Protected routes */}
      <Route 
        path='/profile' 
        element={<Profile />} 
        loader={({ request }) => profileLoader(request, currentUser)}
        action={async ({ request }) => await profileAction(request, handleUpdateEmail, handleUpdatePassword)}
      />
      <Route 
        path='/add-meal' 
        element={<AddMeal />} 
        loader={({ request }) => addMealLoader(request, currentUser)}
      />
      <Route 
        path='/today-list' 
        element={<TodayList />} 
        loader={({ request }) => todayLoader(request, currentUser)}
      />
      <Route 
        path='/dashboard'
        element={<Dashboard />}
        loader={({ request }) => dashboardLoader(request, currentUser)}
      />

      {/* Page not found */}
      <Route path='*' element={<NotFound/>}/>
    </Route>
  ));

  return (
    <RouterProvider router={router}/>
  );
}


export default App;