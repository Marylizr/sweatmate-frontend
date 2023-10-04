import React from 'react';
import styles from './home.module.css';
import Login from '../login/Login';
import SignUp from '../signUp/SignUp';


const Home = () => {
  return (
    <div className={styles.container}>
    <img src="https://res.cloudinary.com/da6il8qmv/image/upload/v1696235230/trainers_lgabkh.png" alt='' />
      <Login />
      <SignUp />
  </div>
  )
}

export default Home;