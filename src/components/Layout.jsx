import React, { useContext, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import '../styles/navbar.css';


function Layout(props) {
  return (
    <>
      <Navbar loggedIn={props.loggedIn} setLoggedIn={props.setLoggedIn}/>
      <Outlet context={[props.lo]}/>
    </>
  )
}

function Navbar(props) {

  if (!props.loggedIn){
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
          <NavItem label="#Logo" dest="/"/>
          <NavItem label="Add a meal" dest="addMeal"/>
          <NavItem label="Today-list" dest="todayList" />
          <NavItem label="Log out" dest="/" setLoggedIn={props.setLoggedIn}/>
        </ul>
      </div>
    );
  }
}

function NavItem(props) {

  if (props.setLoggedIn){
    return (
      <li className='nav-item' onClick={() => {
          localStorage.removeItem("loggedin");
          props.setLoggedIn(false);
        }}>
        <NavLink to={props.dest}>
          {props.label}
        </NavLink>
      </li>
    );
  }

  return (
    <li className='nav-item'>
      <NavLink 
        to={props.dest}
        className={
          ({isActive}) => props.label === "#Logo" ? "logo" : isActive ? "activeNavLink" : ""
        }>
        {props.label}
      </NavLink>
    </li>
  );
}

export default Layout