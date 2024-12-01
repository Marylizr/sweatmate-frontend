import React, { useState, useEffect } from "react";
import customFetch from "../../api";
import styles from "./moodTracker.module.css";

const MoodTrackerModal = ({ isOpen, closeModal }) => {
  const [mood, setMood] = useState("");
  const [comments, setComments] = useState("");
  const [name, setName] = useState(""); // User's display name
  const [userName, setUserName] = useState(""); // User's unique ID
  const [isLoading, setIsLoading] = useState(true); // Loading state for user data

  const moods = ["Happy", "Sad", "Stressed", "Anxious", "Excited", "Tired"];

  // Fetch the logged-in user's details
  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        if (json && json._id) {
          setUserName(json._id); // Set user ID
          setName(json.name || "User"); // Set display name (fallback to "User")
        } else {
          console.error("Invalid user data received:", json);
        }
      })
      .catch((error) => console.error("Error fetching user data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSubmit = () => {
    if (!mood) return alert("Please select a mood!");
    if (!userName) return alert("User information is missing. Please try again later.");

    const data = {
      userName, // Include user ID in the payload
      mood,
      comments,
      date: new Date().toISOString(),
    };

    customFetch("POST", "moodTracker", { body: data })
      .then(() => {
        closeModal(); // Close modal on successful submission
        setMood(); // Reset mood
        setComments(""); // Reset comments
      })
      .catch((error) => console.error("Error logging mood:", error));

      console.log(data)
  };

  

  if (!isOpen || isLoading) return null; // Don't render modal if not open or loading

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>{name}, How do you feel today?</h2>
        <div className={styles.moods}>
          {moods.map((item) => (
            <button
              key={item}
              className={`${styles.moodButton} ${mood === item ? styles.selected : ""}`}
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
        <button className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default MoodTrackerModal;
