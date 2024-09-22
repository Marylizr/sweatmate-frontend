import React, { useState, useContext, useEffect} from 'react';
import { UserContext } from '../../components/userContext/userContext';
import customFetch from '../../api';
import styles from '../../pages/workoutHistoric/workoutHistoric.module.css'
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';
import CardPt from './CardPt';


const DesignedByPt = () => {
   const [currentWorkout, setCurrentWorkout] = useState([]);
   const [formattedDate, setFormattedDate] = useState('');
   const { gender } = useContext(UserContext);

   // get current date and turn it into local date
   useEffect(() => {
      const today = new Date();
      const formattedDate = today.toLocaleDateString();
      setFormattedDate(formattedDate);
   }, []);

   // get workouts and filter by date and user
   useEffect(() => {
      customFetch("GET", "designedByPt")
         .then((json) => {
            // filter workout by date and user
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
         <div className={styles.headline}>

               { gender === 'female' ? <Link to="/dashboard/female"> <img className={styles.arrow}  src={arrow_left} alt='' /></Link> : 
               <Link to="/dashboard/male"><img className={styles.arrow} src={arrow_left} alt='' /></Link> }

               <h3> Today´s Workout {formattedDate}</h3>
         </div>
            <div className={styles.wrap}>
               {
                  currentWorkout && currentWorkout.length > 0 &&
                  currentWorkout.map(item =>
                     <CardPt item={item} id={item._id} key={item._id} />
                  )
               }
            </div>
         <div className={styles.message}>{(!currentWorkout || currentWorkout.length === 0) && (<p>no Workouts today yet!</p>)}</div>
      </div>
   )
}

export default DesignedByPt;
