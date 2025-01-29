import React, { useState } from 'react';
import styles from '../../pages/workoutsDash/modal.module.css';
import customFetch from '../../api';

const CardDeleteFavs = ({ item }) => {
  const { picture, workoutName, rounds, date } = item;
  const formattedDate = new Date(date).toDateString();
  const [showRounds, setShowRounds] = useState(false); // State to toggle round details


  const handleDelete = async () => {
    try {
      await customFetch("DELETE", "fav/" + item._id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting the workout:", error);
      alert("Failed to delete the workout. Please try again.");
    }
  };

  return (
    <div className={styles.infoCard}>
      <img src={picture} alt="Workout" />
      <div className={styles.left}>
        <p>
          <strong>Workout:</strong> {workoutName} <br />
          <strong>Date:</strong> {formattedDate}
        </p>

        {/* Toggle Button for Rounds */}
        {rounds && rounds.length > 0 && (
          <div className={styles.roundsSection}>
            <button
              className={styles.toggleButton}
              onClick={() => setShowRounds(!showRounds)}
            >
              {showRounds ? 'Hide Rounds' : 'Show Rounds'}
            </button>

            {showRounds && (
              <div className={styles.roundDetails}>
                <ul>
                  {rounds.map((round, index) => (
                    <li key={index}>
                      <p>
                        <strong>Round #{index + 1}</strong>
                      </p>
                      <p>Reps: {round.reps}</p>
                      <p>
                        Weight: {round.weight} {round.unit}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <button onClick={handleDelete}>Delete</button>
      </div>
    </div>
  );
};

export default CardDeleteFavs;
