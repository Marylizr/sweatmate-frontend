import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../landing/landing.module.css';
import logo from '../../utils/logo.jpeg';
import beGirl from '../../utils/beGirl.jpg';

const Landing = () => {
  
  return (
    <div className={styles.container}>
      <div className={styles.girl}>
        <img src={beGirl} alt='girl'/>
      </div>
      <div className={styles.leftdiv}>
     
          <img src={logo} alt='logo beFit'/>

        <div>
            <h2>Welcome!</h2>
            <p>you are about to become <br/>
              into your best version</p>
        </div>

        <div className={styles.buttons}>
          <div className={styles.sign}>
            <Link to='/signup' >Sign me Up</Link>
          </div>
          <div className={styles.log}>
            <Link to='/login' >Log me In</Link>
          </div>
        </div>
          
       </div>
    </div>
  )
}

export default Landing