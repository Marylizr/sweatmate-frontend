import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from '../addWorkout/addworkout.module.css';
import customFetch from '../../api';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../api/auth";
import styled from 'styled-components';
import NavButton from '../../components/navButton/navButton';
import logo from '../../utils/logo_new.png'

const WorkoutsMenu = () => {

  const [user, setUser] = useState();
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);

  const getUser = () => {
    customFetch("GET", "user/me")
    .then((json) => { 
       setUser(json.name);  
       }); }
  
    useEffect(() => {
    getUser() 
  },[]);

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
          <h2>{user}!</h2>
          
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
              <Link to='/dashboard'> Dashboard </Link>
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
   display: flex;
   align-items: center;
   align-content: center
   justify-content: space-between;
   z-index: 100;


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

     a {
       color: grey;
       display: block;
     }
     a:hover {
       color:teal;
       font-size:20px;
       font-weight:bold;
     }

     img {
      width:250px;
     }

     @media(min-width:768px){
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

    @media(max-width: 1024px) {
      font-size: 13px;
     
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
  right: -117px;
  top: 30px;
   @media(min-width:768px){
      display: none;
   }
}

`



export default WorkoutsMenu;