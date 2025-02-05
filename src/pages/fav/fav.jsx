import React, { useState, useEffect } from 'react';
import customFetch from '../../api';
import styles from '../fav/fav.module.css';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';

const SavedWorkouts = ({ show, setShow, user }) => {
  const [savedWorkouts, setSavedWorkouts] = useState([]);

  // Fetch saved workouts for the user
  useEffect(() => {
    if (!user) return;

    const fetchSavedWorkouts = async () => {
      try {
        const workouts = await customFetch('GET', `fav?userId=${user._id}`);
        // Ensure workouts is an array before setting state
        setSavedWorkouts(Array.isArray(workouts) ? workouts : []);
      } catch (error) {
        console.error('Error fetching saved workouts:', error);
        setSavedWorkouts([]); // Ensure state is always an array
      }
    };

    fetchSavedWorkouts();
  }, [user]);

  // Group saved workouts by month
  const groupByMonth = (workouts) => {
    if (!Array.isArray(workouts) || workouts.length === 0) return {}; // Ensure workouts is an array

    return workouts.reduce((acc, workout) => {
      if (!workout.date) return acc; // Prevents errors if `date` is missing
      const workoutDate = new Date(workout.date);
      const monthName = workoutDate.toLocaleString('default', { month: 'long' });
      if (!acc[monthName]) acc[monthName] = [];
      acc[monthName].push(workout);
      return acc;
    }, {});
  };

  const workoutsByMonth = groupByMonth(savedWorkouts);

  return (
    <div className={styles.container}>
      <h2>What you have trained, {user?.name}</h2>
      <div className={styles.wrap}>
        {Object.entries(workoutsByMonth).map(([month, workouts]) => (
          <div key={month} className={styles.click}>
            <div className={styles.toggle}>
              <p onClick={() => setShow((prev) => (prev === month ? null : month))}>
                {show === month ? 'Hide' : 'Show'} {month}
              </p>
            </div>
            {show === month && (
              <div className={styles.block}>
                {workouts.map((workout) => (
                  <CardDeleteFavs key={workout._id} item={workout} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedWorkouts;
