import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/navbar.css';
import { useAuth } from '../contexts/AuthContext';


function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}

function Navbar() {

  const { currentUser } = useAuth();

  if (!currentUser){
    return (
      <div className='navbar'>
      <ul className='navbar-nav'>
        <NavItem label="#Logo" dest="/"/>
        <NavItem label="Log in" dest="login" />
      </ul>
    </div>
    );
  }
  else {
    return (
      <div className='navbar'>
        <ul className='navbar-nav'>
          <NavItem label="#Logo" dest="/" />
          <NavItem label="Dashboard" dest="/dashboard" />
          <NavItem label="Add a meal" dest="addMeal" />
          <NavItem label="Today-list" dest="today-list" />
          <NavItem label="Profile" dest="/profile" />
        </ul>
      </div>
    );
  }
}

function NavItem(props) {
  return (
    <NavLink to={props.dest} className={
      ({isActive}) => props.label === "#Logo" ? "logo nav-item" : isActive ? "activeNavLink nav-item" : "nav-item"
    }>
      <li>{props.label}</li>
    </NavLink>
  );
}

export default Layout