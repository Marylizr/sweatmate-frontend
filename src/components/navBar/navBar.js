import React from 'react'
import styles from '../navBar/navbar.module.css';
import { Link } from 'react-router-dom';
import logo from '../../utils/logo.jpeg';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../api/auth";


const NavBar = () => {

   const navigate = useNavigate();
    const onLogOut = () => {
        removeSession()
        navigate("/login");
      };
   
  return (
   <div className={styles.container}>
      <header id={styles.topnav}>
         <nav>	
            <img src={logo} alt='logo beFit'/>
            <ul>
               <li><Link to="/">Home</Link></li>
               <li><Link to="/about">About Us</Link></li>
               <li><Link to="/healthyTips">Healthy Tips</Link></li>
               <li><Link to="/FitMenu">Fit Menu</Link></li>
               <li><Link to="/contact">Contact</Link></li>
            </ul>
            <button onClick={() => onLogOut()}>Log out</button>
            {/* <div className={styles.seach}> <input onChange={event => 
               {const value = event.target.value;
               onSearch(value) 
               }} type="text" placeholder="search" />
            </div>   */}
         </nav>
      </header>
 </div>
  )
}

export default NavBar;