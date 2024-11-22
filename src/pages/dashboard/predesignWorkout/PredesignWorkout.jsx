import React from 'react';
import styles from '../predesignWorkout/predesignworkout.module.css';
import fit from '../../../assets/fit.svg'
import { Link } from 'react-router-dom';

const PredesignWorkout = () => {


  
  return (
    <div className={styles.container}>
      
      <Link to='/main/predesigned'> 
        <img src={fit} alt='fit-icon'/>
        <h2>PreDesign workouts</h2>
      </Link>

    </div>
  )
}

export default PredesignWorkout;