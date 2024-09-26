import React, { useState, useEffect, useCallback } from 'react';
import styles from './training.module.css';
import customFetch from '../../api';
// import TrainingStorical from './TrainingStorical';
import fitness from '../../assets/fitness.svg';

const WeekStorical = () => {
  const [entrenamientos, setEntrenamientos] = useState(0);
  const [email, setEmail] = useState([]);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setEmail(json.email);
      })
      .catch((error) => {
        console.log(error);
      });

    customFetch("GET", "fav")
      .then((json) => {
        setHistorial(json);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getWorkouts = useCallback(() => {
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Subtract 7 days

    const workoutsThisWeek = historial.filter(item =>
      item.userName === `${email}` && new Date(item.date) > lastWeekStart
    );

    const uniqueDays = [...new Set(workoutsThisWeek.map(item => new Date(item.date).toDateString()))];
    console.log(`unique days ${uniqueDays}`)
    return uniqueDays.length;
   
  }, [historial, email]);

  useEffect(() => {
    const daysWorkedOut = getWorkouts();
    setEntrenamientos(daysWorkedOut);
   
  }, [getWorkouts]);
 
  
  const getDays = () => {
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Subtract 7 days

    const workoutsThisWeek = historial.filter(item =>
      item.userName === `${email}` && new Date(item.date) > lastWeekStart
    );

    const uniqueDays = [...new Set(workoutsThisWeek.map(item => new Date(item.date).toDateString()))];
    
    return uniqueDays;
  }

  const days = getDays()
  console.log(`unique days ${days}`)

   

  return (
    <div className={styles.container}>
      <img  src={fitness} alt='fit-icon'/>
      <h2>Weekly Workouts</h2>
      <p>Haz entrenado: {entrenamientos} días esta semana!</p>
      <p>{days }</p>
{/* 
      {historial.filter(item => item.userName === `${email}`).map(item => (
        <TrainingStorical
          key={item._id}
          item={item}
          id={item._id}
        />
      ))} */}
    </div>
  );
};

export default WeekStorical;
