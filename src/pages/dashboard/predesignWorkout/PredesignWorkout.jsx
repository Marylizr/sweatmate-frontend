import React from 'react';
import styles from '../predesignWorkout/predesignworkout.module.css';
import fit from '../../../assets/fit.svg'



const PredesignWorkout = () => {
  return (
    <div className={styles.container}>
      <img src={fit} alt='fit-icon'/>
      <h2>PreDesign workouts</h2>
    </div>
  )
}

export default PredesignWorkout;