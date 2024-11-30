import React from "react";
import styles from "./moodTracker.module.css";

const MoodSuggestions = ({ mood }) => {
  const {
    suggestions,
    playlist,
    motivationalMessage,
    menstrualCycleCare,
  } = mood || {};

  return (
    <div className={styles.container}>
      <h2>Today's Suggestions</h2>

      {/* Motivational Message */}
      {motivationalMessage && (
        <div className={styles.section}>
          <h3>Motivational Message</h3>
          <p>{motivationalMessage}</p>
        </div>
      )}

      {/* Suggested Workouts */}
      {suggestions && suggestions.length > 0 && (
        <div className={styles.section}>
          <h3>Workout Suggestions</h3>
          <ul>
            {suggestions.map((suggestion, index) => (
              <li key={index}>{suggestion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Playlist */}
      {playlist && playlist.length > 0 && (
        <div className={styles.section}>
          <h3>Playlist</h3>
          <ul>
            {playlist.map((song, index) => (
              <li key={index}>
                <a href={song.url} target="_blank" rel="noopener noreferrer">
                  {song.name} by {song.artist}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Menstrual Cycle Care */}
      {menstrualCycleCare && (
        <div className={styles.section}>
          <h3>Menstrual Cycle Care</h3>
          <p>{menstrualCycleCare}</p>
        </div>
      )}
    </div>
  );
};

export default MoodSuggestions;
