import React, { createContext, useState } from 'react'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import './styles/general.css';

import Home from './pages/Home';
import Login from './pages/Login';
import AddMeal from './pages/AddMeal';
import TodayList from './pages/TodayList';
import NotFound from './pages/NotFound';

import Error from './components/Error';
import Layout from './components/Layout';

import { requireAuth } from './utils';
import { loader as loginLoader, action as loginAction } from './pages/Login';

import './server';


function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("loggedin"));

  const router = createBrowserRouter(createRoutesFromElements(
    <Route path='/' element={<Layout loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}>

      <Route 
        index 
        element={<Home/>} 
      />

      <Route 
        path='login' 
        element={<Login/>} 
        loader={loginLoader}
        action={(actionObj) => loginAction(actionObj.request, setLoggedIn)}
      />

      <Route 
        path='addMeal' 
        element={<AddMeal/>} 
        loader={async (loaderObj) => await requireAuth(loaderObj)}
      />

      <Route 
        path='todayList' 
        element={<TodayList/>} 
        loader={async (loaderObj) => await requireAuth(loaderObj)}
      />

      <Route path='*' element={<NotFound/>}/>
    </Route>
  ));

  return (
    <RouterProvider router={router}/>
  );
}


export default App;