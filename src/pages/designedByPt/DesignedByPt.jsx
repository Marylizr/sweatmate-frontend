import React, { useState, useEffect } from 'react';
import customFetch from '../../api';
import styles from '../../pages/designedByPt/designedbypt.module.css';
import CardPt from '../designedByPt/CardPt';
import NavBar from '../../components/navBar/navBar';

const DesignedByPt = () => {
   const [currentWorkout, setCurrentWorkout] = useState([]);

   const [user, setUser] = useState({ userName: '' });

   useEffect(() => {
      // Fetch the current user's data and set userName (email)
      customFetch("GET", "user/me")
         .then((json) => {
            setUser({ userName: json.email }); // Assign the email as userName
         })
         .catch((error) => console.error("Error fetching user:", error));
   }, []);

   // Get the current date in local time format
   // Get the current date as 'YYYY-MM-DD' in the local time zone
const getCurrentLocalDate = () => {
   const today = new Date();
   return today.toISOString().split('T')[0]; // Returns 'YYYY-MM-DD' in local time zone
};

const formattedDate = getCurrentLocalDate();

// Revised workout filtering logic
      useEffect(() => {
         customFetch("GET", "personaltrainer")
            .then((json) => {
               console.log("Raw fetched workouts:", json); // Log raw data for inspection

               // Filter workouts by today's local date and current user's userName (email)
               const filteredWorkouts = json.filter(item => {
                  const workoutDate = new Date(item.date).toISOString().split('T')[0]; // Ensure workout date is 'YYYY-MM-DD'
                  const isDateMatch = workoutDate === formattedDate;
                  const isUserMatch = item.userName === user.userName;

                  console.log(`Workout Date: ${workoutDate}, Formatted Date: ${formattedDate}, Date Match: ${isDateMatch}`);
                  console.log(`Workout User: ${item.userName}, Current User: ${user.userName}, User Match: ${isUserMatch}`);

                  return isDateMatch && isUserMatch;
               });

               console.log("Filtered workouts:", filteredWorkouts); // Check filtered workouts
               setCurrentWorkout(filteredWorkouts);
            })
            .catch((error) => {
               console.log("Error fetching workouts:", error);
            });
      }, [formattedDate, user.userName]); // Depend on user.userName to refetch when user changes


   // Fetch workouts and filter by local date and userName
   useEffect(() => {
      customFetch("GET", "personaltrainer")
         .then((json) => {
            console.log("Raw fetched workouts:", json); // Log raw data for inspection

            // Filter workouts by today's local date and current user's userName (email)
            const filteredWorkouts = json.filter(item => {
               const workoutDate = new Date(item.date).toISOString().split('T')[0]; // Convert workout date to 'YYYY-MM-DD' local format
               const isDateMatch = workoutDate === formattedDate;
               const isUserMatch = item.userName === user.userName;

               console.log(`Workout Date: ${workoutDate}, Formatted Date: ${formattedDate}, Date Match: ${isDateMatch}`);
               console.log(`Workout User: ${item.userName}, Current User: ${user.userName}, User Match: ${isUserMatch}`);

               return isDateMatch && isUserMatch;
            });

            console.log("Filtered workouts:", filteredWorkouts); // Check filtered workouts
            setCurrentWorkout(filteredWorkouts);
         })
         .catch((error) => {
            console.log("Error fetching workouts:", error);
         });
   }, [formattedDate, user.userName]); // Depend on user.userName to refetch when user changes

   return (
      <div className={styles.container}>
         <NavBar />
         <div className={styles.headline}>
         
            <h3>Today’s Workout {formattedDate}</h3>
         </div>
         <div className={styles.wrap}>
            {
               currentWorkout && currentWorkout.length > 0
               ? currentWorkout.map(item => <CardPt item={item} id={item._id} key={item._id} />)
               : <div className={styles.message}><p>No Workouts today yet!</p></div>
            }
         </div>
      </div>
   );
};

export default DesignedByPt;
