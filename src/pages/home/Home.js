import React, { useState } from "react";
import styles from "./home.module.css";
import Login from "../login/Login";
import SignUp from "../signUp/SignUp";
import MoodTrackerModal from "../../components/moodTracker/MoodTracker";
import MoodSuggestion from "../../components/moodTracker/MoodSuggestion";
import customFetch from '../../api'


const Home = () => {
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(true); // Modal visibility state
  const [mood, setMood] = useState(null); // User-selected mood state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login/signup state

  const handleLoginOrSignup = () => {
    // Simulate successful login or signup
    setIsAuthenticated(true);
    setIsMoodModalOpen(true); // Open mood tracker modal
  };

  const closeMoodModal = () => setIsMoodModalOpen(false);

  const fetchSuggestions = async (mood) => {
    const response = await customFetch("POST", "moodTracker", { mood });
    setMood(response);
  };

  return (
    <div className={styles.container}>
      <img
        src="https://res.cloudinary.com/da6il8qmv/image/upload/v1696235230/trainers_lgabkh.png"
        alt="Trainers"
      />

      {/* Conditionally Render Login/Signup or Content */}
      {!isAuthenticated ? (
        <>
          <Login onLogin={handleLoginOrSignup} />
          <SignUp onSignUp={handleLoginOrSignup} />
        </>
      ) : (
        <>
          <MoodTrackerModal
            isOpen={isMoodModalOpen}
            closeModal={closeMoodModal}
            onMoodSelect={fetchSuggestions}
          />
          {mood && <MoodSuggestion mood={mood} />}
        </>
      )}
    </div>
  );
};

export default Home;