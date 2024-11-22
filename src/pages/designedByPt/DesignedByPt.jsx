import React, { useState, useEffect } from "react";
import customFetch from "../../api";
import styles from "../../pages/designedByPt/designedbypt.module.css";
import CardPt from "../designedByPt/CardPt";
import Card from './card/Card';
import NavBar from "../../components/navBar/navBar";

const DesignedByPt = () => {
  const [personalTrainerWorkouts, setPersonalTrainerWorkouts] = useState([]); // Workouts from /personalTrainer
  const [preWorkouts, setPreWorkouts] = useState([]); // Workouts from /preWorkout
  const [user, setUser] = useState(null); // Logged-in user details

  // Get today's date in YYYY-MM-DD format
  const getCurrentLocalDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const formattedDate = getCurrentLocalDate();

  // Fetch logged-in user details
  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setUser(json); // Store full user details (e.g., userId)
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  // Fetch manually assigned workouts
  useEffect(() => {
    if (!user) return; // Wait until user details are fetched

    customFetch("GET", `personalTrainer?userId=${user._id}`)
      .then((json) => {
        // Filter workouts by today's local date
        const filteredWorkouts = json.filter((item) => {
          const workoutDate = new Date(item.date).toISOString().split("T")[0];
          return workoutDate === formattedDate;
        });

        setPersonalTrainerWorkouts(filteredWorkouts);
      })
      .catch((error) => console.error("Error fetching personal trainer workouts:", error));
  }, [user, formattedDate]);

  // Fetch pre-designed workouts
  useEffect(() => {
    if (!user) return; // Wait until user details are fetched

    customFetch("GET", `preWorkout?userId=${user._id}`)
      .then((json) => {
        // Filter workouts by today's local date
        const filteredWorkouts = json.filter((item) => {
          const workoutDate = new Date(item.date).toISOString().split("T")[0];
          return workoutDate === formattedDate;
        });

        setPreWorkouts(filteredWorkouts);
      })
      .catch((error) => console.error("Error fetching pre-designed workouts:", error));
  }, [user, formattedDate]);

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.headline}>
        <h3>Today’s Workouts - {formattedDate}</h3>
      </div>

      {/* Manually Assigned Workouts Section */}
      <div className={styles.section}>
        <div className={styles.wrap}>
          {personalTrainerWorkouts.length > 0 ? (
            personalTrainerWorkouts.map((item) => (
              <CardPt item={item} id={item._id} key={item._id} />
            ))
          ) : (
            <div className={styles.message}>
              <p>your PT hasn't sent you a workout yet!</p>
            </div>
          )}
        </div>
      </div>

      {/* Pre-Designed Workouts Section */}
      <div className={styles.section}>
        <h4>Pre-Designed Workouts</h4>
        <div className={styles.wrap}>
          {preWorkouts.length > 0 ? (
            preWorkouts.map((item) => (
              <Card item={item} id={item._id} key={item._id} />
            ))
          ) : (
            <div className={styles.message}>
              <p>No workouts for today yet!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignedByPt;
