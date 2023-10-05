import React, {useContext } from 'react'
import { UserContext } from '../../components/userContext/userContext';
import styles from '../workoutsDash/workoutDash.module.css';
import WorkoutHistoric from '../workoutHistoric/WorkoutHistoric';
import SavedWorkouts from '../fav/fav';
import NavBar from '../../components/navBar/navBar';

const WorkoutDash = () => {
   const { name} = useContext(UserContext);


  return (
    <div className={styles.container}>
        <NavBar />
     <div>
      <h2>{name}, Welcome to your WorkOuts Dashboard</h2>
     </div>

      <WorkoutHistoric />
      <SavedWorkouts />

    </div>
  )
}

export default WorkoutDash