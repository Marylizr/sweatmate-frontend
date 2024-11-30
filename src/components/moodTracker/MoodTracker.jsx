import React, { useState } from "react";
import customFetch from "../../api";
import styles from "./moodTracker.module.css";

const MoodTrackerModal = ({ isOpen, closeModal }) => {
  const [mood, setMood] = useState("");
  const [comments, setComments] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const moods = ["Happy", "Sad", "Stressed", "Anxious", "Excited", "Tired"];

  const handleSubmit = () => {
    if (!mood) return alert("Please select a mood!");

    const data = { mood, comments, date: new Date().toISOString() };
    customFetch("POST", "logMood", { body: data })
      .then(() => {
        setIsSubmitted(true); // Mark as submitted
        setTimeout(closeModal, 2000); // Close modal after 2 seconds
      })
      .catch((error) => console.error("Error logging mood:", error));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        {!isSubmitted ? (
          <>
            <h2>How do you feel today?</h2>
            <div className={styles.moods}>
              {moods.map((item) => (
                <button
                  key={item}
                  className={`${styles.moodButton} ${
                    mood === item ? styles.selected : ""
                  }`}
                  onClick={() => setMood(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <textarea
              placeholder="Any additional comments?"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
            <button
              className={styles.submitButton}
              onClick={handleSubmit}
              disabled={isSubmitted} // Disable button after submission
            >
              Submit
            </button>
          </>
        ) : (
          <div className={styles.successMessage}>
            <h3>Thank you for sharing your mood!</h3>
            <p>Your mood has been logged successfully.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MoodTrackerModal;
