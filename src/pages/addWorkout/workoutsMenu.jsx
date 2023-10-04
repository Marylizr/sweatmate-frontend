import React, { useState, useContext} from 'react';
import { UserContext } from '../../components/userContext/userContext';
import { Link } from 'react-router-dom';
import styles from '../addWorkout/addworkout.module.css';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../api/auth";
import styled from 'styled-components';
import NavButton from '../../components/navButton/navButton';
import logo from '../../utils/logo_new.png'

const WorkoutsMenu = () => {

  
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const { name, role } = useContext(UserContext);

  const onLogOut = () => {
    removeSession()
    navigate("/");
  };

  const handleClick = () => {
    //when the value is true will passed it false and all over
    setClicked(!clicked)
 }


  return (
    <div className={styles.menu}>
      <NavContainer>

        <div className={`links ${clicked ? 'active' : ''}`}>
          <img src={logo} alt=''/>
          <h2>Hi, {name}!</h2>
          
            <div className={styles.side_menu}>
              <Link to='/main/addworkout'> Add Workout </Link>
            </div>
            <div className={styles.side_menu}>
              <Link to='/main/workouts'> Edit Workout </Link> <br />
            </div>
            <div className={styles.side_menu}>
              <Link to='/main/userList'> User List </Link>
            </div>
            <div className={styles.side_menu}>
            { role === 'admin' && <Link to="/dashboard/female">female Dashboard </Link>  }
            { role === 'admin' && <Link to="/dashboard/male">Male Dashboard</Link>}

            </div>
            <div className={styles.side_menu}>
              <Link to='/main/openAi'> ChatBot </Link>
            </div>
            <div className={styles.side_menu}>
              <button onClick={() => {onLogOut()}} > Log Out </button>
            </div>
        </div>
        <div className='burger'>
          <NavButton clicked={clicked} handleClick={handleClick}/>
        </div>

      </NavContainer>
    </div>
  )
}
const NavContainer = styled.nav`
    /* Estilos para móviles */

  display: flex;
   align-items: center;
   align-content: center
   justify-content: space-between;
   z-index: 100;
 
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

     a {
       color: grey;
       display: block;
       margin-right:1em;
       font-size: 12px;
       text-decoration: none;
     }

     a:hover {
       color:teal;
       font-size:20px;
       font-weight:bold;
     }

     img {
      width:250px;
     }
  }


  .links.active {
    width: 88%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    top: 10%;
    left: 0;
    right: 0;
    text-align: center;
    background: white;
    z-index:100;
    
    a{
      font-size: 1.2rem;
      color: grey;
    }
  }

  .links > button {
    Background-color: transparent;
    border: none;
    color: teal;
    font-size: 1.3em;
    margin-top: 1rem;
    margin-right: 1em;
    margin-bottom: 1em;
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
    right: -117px;
    top: 30px;
  }

  @media (min-height: 1182px) and (max-width: 600px) {
    display: flex;
    align-items: center;
    align-content: center
    justify-content: space-between;
    z-index: 100;
  
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
 
      a {
        color: grey;
        display: block;
        margin-right:1em;
        font-size: 12px;
        text-decoration: none;
      }
 
      a:hover {
        color:teal;
        font-size:20px;
        font-weight:bold;
      }
 
      img {
       width:250px;
      }
   }
 
   .links.active {
    width: 44%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    top: 10%;
    left: 152px;
    right: 0;
    text-align: center;
    background: white;
    z-index: 100;
     
     a{
       font-size: 1.2rem;
       color: grey;
     }
   }
 
   .links > button {
     Background-color: transparent;
     border: none;
     color: teal;
     font-size: 1.3em;
     margin-top: 1rem;
     margin-right: 1em;
     margin-bottom: 1em;
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
     right: -270px;
    top: 100px;
   }
  }



 @media (min-width: 601px) and (max-width: 900px) and (orientation: landscape) {
    display: flex;
    align-items: center;
    align-content: center
    justify-content: space-between;
    z-index: 100;
  
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
 
      a {
        color: grey;
        display: block;
        margin-right:1em;
        font-size: 12px;
        text-decoration: none;
      }
 
      a:hover {
        color:teal;
        font-size:20px;
        font-weight:bold;
      }
 
      img {
       width:250px;
      }
   }
 
   .links.active {
    width: 44%;
    display: block;
    margin-left: auto;
    margin-right: auto;
    top: 10%;
    left: 152px;
    right: 0;
    text-align: center;
    background: white;
    z-index: 100;
     
     a{
       font-size: 1.2rem;
       color: grey;
     }
   }
 
   .links > button {
     Background-color: transparent;
     border: none;
     color: teal;
     font-size: 1.3em;
     margin-top: 1rem;
     margin-right: 1em;
     margin-bottom: 1em;
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
     right: -270px;
    top: 100px;
   }
  }


      /* Estilos para pantallas grandes */
      @media (min-width: 900px) {
        
     .links {
       margin: 0;
     position: initial;
     display: flex;
     flex-direction: column;
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
 
     .links.active {
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
 
       .links > button {
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
 
       .burger {
         display:none;
       }

   `



export default WorkoutsMenu;