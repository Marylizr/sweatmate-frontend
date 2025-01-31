import React, { useState, useEffect, useCallback } from 'react';
import styles from './training.module.css';
import customFetch from '../../api';
import fitness from '../../assets/fitness.svg';

const WeekStorical = () => {
  const [entrenamientos, setEntrenamientos] = useState(0);
  const [user, setUser] = useState(null); // Store user object
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    // Fetch user data
    customFetch("GET", "user/me")
      .then((json) => {
        if (json?._id) {
          setUser(json); // Store the full user object
        } else {
          console.error("Invalid user data:", json);
          setUser(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUser(null);
      });

    // Fetch workout history
    customFetch("GET", "fav")
      .then((json) => {
        if (Array.isArray(json)) {
          setHistorial(json); // Ensure it's an array
        } else {
          console.error("Unexpected data format for historial:", json);
          setHistorial([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching historial:", error);
        setHistorial([]);
      });
  }, []);

  // Function to calculate unique workout days in the last 7 days
  const getWorkouts = useCallback(() => {
    if (!historial?.length || !user?._id) return 0; // Ensure historial exists and user is set

    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7); // Get date 7 days ago

    const workoutsThisWeek = historial.filter(
      (item) => item.userId === user._id && new Date(item.date) > lastWeekStart
    );

    const uniqueDays = [...new Set(workoutsThisWeek.map(item => new Date(item.date).toDateString()))];
    console.log(`Unique workout days this week:`, uniqueDays);

    return uniqueDays.length;
  }, [historial, user]);

  useEffect(() => {
    const daysWorkedOut = getWorkouts();
    setEntrenamientos(daysWorkedOut);
  }, [getWorkouts]);

  // Function to get workout dates for the last 7 days
  const getDays = () => {
    if (!historial?.length || !user?._id) return [];

    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const workoutsThisWeek = historial.filter(
      (item) => item.userId === user._id && new Date(item.date) > lastWeekStart
    );

    const uniqueDays = [...new Set(workoutsThisWeek.map(item => new Date(item.date).toDateString()))];
    return uniqueDays;
  };

  const days = getDays();

  return (
    <div className={styles.container}>
      <img src={fitness} alt='fit-icon' />
      <h2>Weekly Workouts</h2>
      {user ? (
        <>
          <p>{user.name}, you have trained: {entrenamientos} days this week!</p>
          <p>{days.length > 0 ? days.join(", ") : "No workouts recorded this week"}</p>
        </>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default WeekStorical;
