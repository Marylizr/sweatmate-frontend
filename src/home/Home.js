import React from 'react';
import styles from '../home/home.module.css';
import Landing from '../pages/landing/Landing';



const Home = () => {
  return (
    <div className={styles.home}>
       <Landing />
       
    </div>
  )
}

export default Home