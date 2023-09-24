import React, { useState, useEffect } from 'react';
import styles from './training.module.css';
import customFetch from '../../api';
import TrainingStorical from './TrainingStorical';

const WeekStorical = ({onClick}) => {
  // const [entrenamientos, setEntrenamientos] = useState([])

  const [name, setName ] = useState()

  const [historial, setHistorial] = useState([
    { day: 'Monday'},{ day: 'Tuesday'},{ day: 'Wednesday'},{ day: 'Thusday'},{ day: 'Friday'},{ day: 'Saturday'},{ day: 'Sunday'},
  ]);

  useEffect(() => {
    customFetch("GET", "user/me")
    .then((json) => {
    setName(json.name);
    })
  }, [name, setName]);

  useEffect(() => {
    customFetch("GET", "fav")
      .then((json) => {
      setHistorial(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setHistorial]);


     return (
       <div className={styles.container}>
         <h2>Weekly Workouts</h2>
         
        {historial.filter( item => item.userName === `${name}`).map(item => (
           <TrainingStorical 
              key={item._id}  
              item={item} 
              id={item._id} 
              historial={historial}
           />
         ))}
       </div>
     );
   };
   
  
export default WeekStorical;