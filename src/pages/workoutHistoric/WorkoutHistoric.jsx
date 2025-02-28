import React, { useEffect, useState } from 'react';
import customFetch from '../../api';
import CardWorkout from '../../components/card/CardWorkouts';
import styles from '../workoutHistoric/workoutHistoric.module.css';

const TodayWorkout = ({ user, setHasWorkouts }) => {
  const [currentWorkout, setCurrentWorkout] = useState([]);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    const today = new Date();
    setFormattedDate(today.toLocaleDateString());
  }, []);

  useEffect(() => {
    if (!user || !formattedDate) return;

    const fetchWorkouts = async () => {
      try {
        const workouts = await customFetch('GET', `saveworkout?userId=${user._id}`);
        const todayWorkouts = workouts.filter((item) => {
          const workoutDate = new Date(item.date).toLocaleDateString();
          return workoutDate === formattedDate;
        });

        setCurrentWorkout(todayWorkouts);

    
        setHasWorkouts(todayWorkouts.length > 0);

      } catch (error) {
        console.error('Error fetching workouts:', error);
      }
    };

    fetchWorkouts();
  }, [user, formattedDate, setHasWorkouts]);

  return (
    <div className={styles.container}>
      <h2>{user.name}, Let's wrap a workout!</h2>
      <h3>Today’s Workout {formattedDate}</h3>
      <div className={styles.wrap}>
        {currentWorkout.length > 0 ? (
          currentWorkout.map((item) => <CardWorkout item={item} key={item._id} />)
        ) : (
          <p>No Workouts for today yet!</p>
        )}
      </div>
    </div>
  );
};


export default TodayWorkout;
