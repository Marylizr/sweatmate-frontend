import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from "../NavButton/navbutton.module.css";

const NavButton = ({path, text}) => {
   const navigate = useNavigate();

  return (
   <div className={styles.navbutton}>
           <button onClick={()=> navigate(path)}>{text}</button>
       </div>
  )
}

export default NavButton;

