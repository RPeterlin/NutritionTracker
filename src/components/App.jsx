import React, { useEffect } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements, redirect } from 'react-router-dom';

import Layout from './Layout';
import ProtectedRoute from './ProtectedRoute';

import Home from '../pages/public/Home';
import Login, { loader as loginLoader, action as loginAction } from '../pages/public/Login';
import Signup, { action as signupAction } from '../pages/public/Signup';
import PasswordReset, { action as passwordResetAction } from '../pages/public/PasswordReset';
import Dashboard, { action as dashboardAction } from '../pages/private/Dashboard';
import AddMeal, { action as addMealAction } from '../pages/private/AddMeal';
import TodayList, { action as todayListAction } from '../pages/private/TodayList';
import Profile, { action as profileAction } from '../pages/private/Profile';

import '../styles/general.css';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';


function App() {

  const { 
    currentUser,
    signup,
    login,
    resetPassword,
    handleUpdateEmail,
    handleUpdatePassword, 
  } = useAuth();

  const {
    addUser,
    updateUser,
    addToLibrary,
    updateLibrary,
    updateTodayList,
  } = useData();

  // console.log("Rerender in App");

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout />}>

      {/* Public routes */}
      <Route 
        index
        element={<Home />}
      />
      <Route 
        path='/login'
        element={<Login />}
        loader={({ request }) => loginLoader(request, currentUser)}
        action={({ request }) => loginAction(request, login)}
      />
      <Route 
        path='/signup'
        element={<Signup />}
        loader={() => currentUser && redirect('/')}
        action={({ request }) => signupAction(request, signup, addUser)}
      />
      <Route 
        path='/password-reset'
        element={<PasswordReset />}
        loader={() => currentUser && redirect('/')}
        action={({ request }) => passwordResetAction(request, resetPassword)}
      />

      {/* Private routes */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute currentUser={currentUser} dest='/dashboard' >
            <Dashboard />
          </ProtectedRoute>
        }
        action={({ request }) => dashboardAction(request, updateLibrary)}
      >
        <Route 
          path='add-meal'
          element={<AddMeal />}
          action={({ request }) => addMealAction(request, addToLibrary)}
        />
      </Route>

      <Route 
        path='/today-list'
        element={
          <ProtectedRoute currentUser={currentUser} dest='/today-list' >
            <TodayList />
          </ProtectedRoute>
        }
        action={({ request }) => todayListAction(request, updateTodayList)}
      />
      <Route 
        path='/profile'
        element={
          <ProtectedRoute currentUser={currentUser} dest='/profile' >
            <Profile />
          </ProtectedRoute>
        }
        action={({ request }) => profileAction(request, handleUpdateEmail, handleUpdatePassword, updateUser)}
      />



      

    </Route>
  ))


  return (
    <RouterProvider router={router} />
  )
}

export default App