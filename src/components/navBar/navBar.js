import React from 'react'
// import styles from '../navBar/navbar.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../api/auth";
import logo from '../../utils/logo.jpeg';
import NavButton from '../navButton/navButton';
import styled from 'styled-components';
import { useState } from 'react';

const NavBar = () => {

   const [clicked, setClicked] = useState(false);

   const navigate = useNavigate();
    const onLogOut = () => {
        removeSession()
        navigate("/login");
      };
   
      const handleClick = () => {
         //when the value is true will passed it false and all over
         setClicked(!clicked)
      }

   return (
      <>
       <NavContainer>
         <div className='logo'>
            <img src={logo} alt='logo'/>
         </div>
         <div className={`links ${clicked ? 'active' : ''}`}>
            <Link to="/">Home |</Link>
            <Link to="/workouts">Workouts |</Link>
            <Link to="/about">About Us |</Link>
            <Link to="/healthyTips">Healthy Tips |</Link>
            <Link to="/FitMenu">Fit Menu |</Link>
            <Link to="/contact">Contact</Link>
            <button onClick={() => {onLogOut()}}>Log out</button>
         </div>
         <div className='burger'>
            <NavButton clicked={clicked} handleClick={handleClick}/>
         </div>
      </NavContainer>
      </>
     
         
      
   )
}

export default NavBar;

const NavContainer = styled.nav`
display: flex;
align-items: center;
align-content: center
justify-content: space-between;


.logo > img {
   width: 7em;
  margin-right:0;
  margin-top: 2em;

  @media(min-width:768px){
   margin-right:3em;
   width: 5em;
 }
}

.links > a {
   text-decoration: none;
   color: grey;
   margin-right:1em;
   font-size: 12px;
}

.links {
   position: absolute;
    top: -700px;
    left: -2000px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    transition: all .5s ease;

    a{
      color: grey;
      display: block;
    }

   @media(min-width:768px){
      position: initial;
      margin: 0;
      display: block;

      a{
       
        color: grey;
        display: inline;
      }
    }
   }

   .links.active {
      width: 100%;
      display: block;
      margin-left: auto;
      margin-right: auto;
      top: 10%;
      left: 0;
      right: 0;
      text-align: center;
      background-color: white;
      a{
        font-size: 1.2rem;
        margin-top: 1rem;
        color: grey;
      }
      @media(min-width:768px){
         display: flex;
         flex-wrap: wrap;
         flex-direction: row;
         align-content: center;
         justify-content: center;
         align-items: center;
         a{
            font-size: 1.2rem;
            margin-top: 0;
            color: grey;
          }
      }
    }

    .links.active > button{
      Background-color: transparent;
      border: none;
      color: teal;
      font-size: 1.3em;
      margin-top: 1rem;
      margin-right: 1em;
      margin-bottom: 1em;
      
      @media(min-width:768px){
         display: flex;
         flex-wrap: wrap;
         flex-direction: row;
         align-content: center;
         justify-content: center;
         align-items: center;
         font-size: 1.3em;
         
      }
    }
  


.burger {
   display: flex;
   @media(min-width:768px){
      display: none;
   }
}

`

  

