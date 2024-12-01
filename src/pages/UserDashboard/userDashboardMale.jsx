import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import NavBar from "../../components/navBar/navBar";
import Settings from "./settings/Settings";
import { Link } from "react-router-dom";
import MacroCalculator from "../../components/macroCalculator/MacroCalculator";
import WeekStorical from "../../components/trainingStorical/WeekStorical";
import customFetch from "../../api";
import insight from "../../assets/insight.svg";
import sports from "../../assets/sports.svg";
import sports1 from "../../assets/sports1.svg";
import fruit from "../../assets/fruit.svg";
import donut from "../../assets/donut.svg";
import map from "../../assets/map.svg";
import Modal from "./Modal/Modal";

const UserDashboardMale = () => {
  const [name, setName] = useState("");
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [comments, setComments] = useState("");
  const [userName, setUserName] = useState(""); // User's unique ID
  const [suggestions, setSuggestions] = useState(null); // Mood suggestions

  const moods = ["Happy", "Sad", "Stressed", "Anxious", "Excited", "Tired"];

  // Suggestions for each mood
  const moodSuggestions = {
    Happy: {
      workout: "High-intensity interval training (HIIT) or dancing.",
      playlist: "Upbeat and energetic tracks.",
      motivationalMessage: "Keep spreading your positivity! You're doing amazing.",
    },
    Sad: {
      workout: "Gentle yoga or a slow walk outdoors.",
      playlist: "Relaxing and uplifting tunes.",
      motivationalMessage: "It's okay to feel down sometimes. Take it one step at a time.",
    },
    Stressed: {
      workout: "Meditative yoga or light stretching.",
      playlist: "Calming and soothing music.",
      motivationalMessage: "Breathe deeply. You're stronger than your stress.",
    },
    Anxious: {
      workout: "Deep breathing exercises or a grounding workout like pilates.",
      playlist: "Instrumental or nature sounds.",
      motivationalMessage: "Focus on the present moment. You've got this.",
    },
    Excited: {
      workout: "Cardio or high-energy workouts.",
      playlist: "Pump-up anthems.",
      motivationalMessage: "Channel your excitement into achieving your goals!",
    },
    Tired: {
      workout: "Gentle stretching or restorative yoga.",
      playlist: "Soft and calming music.",
      motivationalMessage: "Rest and recharge. Your energy will return soon.",
    },
  };

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setName(json.name);
        setUserName(json._id); // Set user ID
        setIsMoodModalOpen(true); // Open mood tracker modal on dashboard load
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const closeMoodModal = () => {
    setIsMoodModalOpen(false); // Close the modal
    setMood(""); // Reset mood
    setComments(""); // Reset comments
    setSuggestions(null); // Reset suggestions
  };

  const handleSubmit = () => {
    if (!mood) return alert("Please select a mood!");
    if (!userName) return alert("User information is missing. Please try again later.");

    const data = {
      userName, // Include user ID in the payload
      mood,
      comments,
      date: new Date().toISOString(),
      suggestions: moodSuggestions[mood], // Attach suggestions based on mood
    };

    customFetch("POST", "moodTracker", { body: data })
      .then(() => {
        setSuggestions(moodSuggestions[mood]); // Display suggestions in the modal
      })
      .catch((error) => console.error("Error logging mood:", error));

    console.log(data);
  };

  return (
    <div className={styles.container}>
      <NavBar />

      <Modal isOpen={isMoodModalOpen} isClosed={closeMoodModal}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {!suggestions ? (
              <>
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
              </>
            ) : (
              <>
                <h2>Suggestions Based on Your Mood</h2>
                <p><strong>Workout:</strong> {suggestions.workout}</p>
                <p><strong>Playlist:</strong> {suggestions.playlist}</p>
                <h2>"{suggestions.motivationalMessage}"</h2>
                <button className={styles.closeButton} onClick={closeMoodModal}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      <div>
        <h2>Welcome to your Dashboard {name}!</h2>
      </div>
      <div className={styles.apps}>
        <Settings />
        <div className={styles.rearrange}>
          <WeekStorical />
          <MacroCalculator />
          <div className={styles.saved}>
            <button>
              <Link to="/allworkouts">
                <img src={sports1} alt="icon" />
                Customize Workout
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/workoutsDashboard">
                <img src={sports} alt="icon" />
                My WorkOuts
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/">
                <img src={map} alt="icon" />
                Find a SweatMate
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/progress">
                <img src={donut} alt="icon" />
                My Progress
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/personaltrainer">
                <img src={insight} alt="icon" />
                From PT
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/mealPlanner">
                <img src={fruit} alt="icon" />
                Meal Plan
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardMale;
