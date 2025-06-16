import React, { useState } from "react";
import styles from "./home.module.css";
import Login from "../login/Login.jsx";
import SignUp from "../signUp/SignUp";
import MoodTrackerModal from "../../components/moodTracker/MoodTracker";
import MoodSuggestion from "../../components/moodTracker/MoodSuggestion";
import customFetch from '../../api'
import Footer from "../../components/footer/Footer";


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
        src="https://res.cloudinary.com/dtb3gqeea/image/upload/v1747741479/trainers_hnpvkt.png"
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
      <Footer />
    </div>
  );
};

export default Home;