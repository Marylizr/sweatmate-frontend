import React, { useState, useEffect } from 'react';
import styles from '../workoutsDash/workoutDash.module.css';
import SavedWorkouts from '../fav/fav';
import TodayWorkout from '../workoutHistoric/WorkoutHistoric';
import NavBar from '../../components/navBar/navBar';
import customFetch from '../../api';

const WorkoutDash = () => {
  const [user, setUser] = useState(null); // Store user info
  const [show, setShow] = useState(null);

  // Fetch user info once when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await customFetch('GET', 'user/me');
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>; // Show loading until user info is available

  return (
    <div className={styles.container}>
      <NavBar />
      <TodayWorkout user={user} /> {/* Pass user to TodayWorkout */}
      <SavedWorkouts show={show} setShow={setShow} user={user} /> {/* Pass user to SavedWorkouts */}
    </div>
  );
};

export default WorkoutDash;
