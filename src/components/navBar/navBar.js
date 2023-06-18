import React from 'react'
// import styles from '../navBar/navbar.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../api/auth";
import logo from '../../utils/logo_new.png';
import NavButton from '../navButton/navButton';
import styled from 'styled-components';
import { useState } from 'react';

const NavBar = () => {

   const [clicked, setClicked] = useState(false);

   const navigate = useNavigate();
    const onLogOut = () => {
        removeSession()
        navigate("/");
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
            <Link to="/dashboard">Home |</Link>
            {/* <Link to="/dashboard">Workouts |</Link> */}
            <Link to="/aboutUs">About Us |</Link>
            <Link to="/healthyTips">Healthy Tips |</Link>
            <Link to="/profile">My Profile |</Link>
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
   z-index: 100;
   background-color: white;


.logo > img {
   width: 13em;
   margin-right:0;

  @media(min-width:768px){
   margin-right:3em;
   width: 13em;
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
   z-index:100;
   padding-bottom: 2em;
    a{
      color: grey;
      display: block;
    }
    a:hover {
      color:teal;
      font-size:20px;
      font-weight:bold;
    }
   @media(min-width:768px){
      margin: 0;
      position: initial;
    display: flex;
    flex-direction: row;
    align-content: center;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    padding-bottom: 0;
      a{
         font-size: 1.2em;
         color: grey;
         display: inline;
      }
    }

    @media(max-width: 1024px) {
      font-size: 13px;
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
      z-index:100;
      
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
         padding-bottom: 0;
         a{
            font-size: 1.2rem;
            margin-top: 0;
            color: grey;
          }
      }
      @media(max-width:667px){
         top: 14%;
      }
    }

    .links > button{
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
         Background-color: transparent;
         border: none;
         color: teal;
         margin: 0;
      }
    }
    .links > button:hover{
      border: 1px solid teal;
      border-radius:5px;
      width:100px;
      height: 40px;
    }
  
.burger {
   display: flex;
   position: relative;
   right: -15px;
   @media(min-width:768px){
      display: none;
   }
}

`

  

