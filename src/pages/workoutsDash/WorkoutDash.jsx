import React, {useState } from 'react'
import styles from '../workoutsDash/workoutDash.module.css';
import SavedWorkouts from '../fav/fav';
import NavBar from '../../components/navBar/navBar';
import TodayWorkout from '../workoutHistoric/WorkoutHistoric';

const WorkoutDash = () => {


   const [show, setShow] = useState(null);

  return (
    <div className={styles.container}>
        <NavBar />
    
      <TodayWorkout />
      <SavedWorkouts show={show}  setShow={setShow}/>

    </div>
  )
}

export default WorkoutDash