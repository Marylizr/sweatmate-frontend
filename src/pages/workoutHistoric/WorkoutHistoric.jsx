import React, { useEffect, useState } from 'react';
import customFetch from '../../api';
import CardWorkout from '../../components/card/CardWorkouts';
import styles from '../workoutHistoric/workoutHistoric.module.css';

const WorkoutHistoric = () => {
   const [currentWorkout, setCurrentWorkout] = useState([]);
   const [formattedDate, setFormattedDate] = useState('');

   // Obtener la fecha actual y convertirla a formato local
   useEffect(() => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      setFormattedDate(formattedDate);
   }, []);

   // Obtener los entrenamientos y filtrar por fecha y usuario
   useEffect(() => {
      customFetch("GET", "saveworkout")
         .then((json) => {
            // Filtrar los entrenamientos por fecha y usuario
            const filteredWorkouts = json.filter(item => {
               const workoutDate = new Date(item.date).toLocaleDateString();
               return workoutDate === formattedDate;
            });

            setCurrentWorkout(filteredWorkouts);
         })
         .catch((error) => {
            console.log(error);
         })
   }, [formattedDate]);

   return (
      <div className={styles.container}>
         <div>
            <h1> Today´s Workout {formattedDate}</h1>
         </div>
         <div className={styles.wrap}>
            {
               currentWorkout && currentWorkout.length > 0 &&
               currentWorkout.map(item =>
                  <CardWorkout item={item} id={item._id} key={item._id} />
               )
            }
         </div>
      </div>
   )
}

export default WorkoutHistoric;
