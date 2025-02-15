import React from "react";
import { Link } from "react-router-dom";
import styles from './notFound.module.css'
import logo from "../utils/logo_new.png";

const NotFound = () => {
  return (
    <div className={styles.container}>
       <img src={logo} alt="logo" />
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <div className={styles.buttonGo}>
        <Link to="/">Go Back to Home</Link>
      </div>
      
    </div>
  );
};

export default NotFound;
