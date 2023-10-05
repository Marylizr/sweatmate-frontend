import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import CardWorkout from '../../components/card/CardWorkouts';
import styles from '../workoutHistoric/workoutHistoric.module.css';


const WorkoutHistoric = () => {

   const [curretWorkout, setCurrentWorkout] = useState([])
   const [email, setEmail] = useState()


   useEffect(() => {
      customFetch("GET", "saveworkout")
        .then((json) => {
        setCurrentWorkout(json);
        })
        .catch((error) => {
          console.log(error);
        })
    }, [setCurrentWorkout]);

    useEffect(() => {
      customFetch( "GET", "user/me")
      .then((json) => {
      setEmail(json.email)
      })
      .catch((e) => {
      console.log(e, 'cannot retrieve user email')
      });
  }, [setEmail])



// Obtener la fecha más reciente
const dates = curretWorkout.map(item => new Date(item.date));
const latestDate = new Date(Math.max(...dates));

// Convertir a formato de fecha local
const formattedDate = latestDate.toLocaleDateString();

console.log(formattedDate);


  return (
    <div  className={styles.container}>
      <div>
        <h1> Today´s Workout {formattedDate}</h1>
      </div>
      <div className={styles.wrap}>
      {
          curretWorkout && curretWorkout.length > 0 && curretWorkout.filter( item => item.userName === `${email}`).map( item => 
            <CardWorkout  item={item} id={item._id} key={item._id}
             />)
        }
      </div>
    </div>
  )
}

export default WorkoutHistoric;