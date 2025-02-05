import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import Settings from "./settings/Settings";
import FaseMenstrual from "../../components/faseMenstrual/FaseMentrual";
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
import axios from "axios";
import happy from "../../assets/happy.svg";
import sad from "../../assets/sad.svg";
import stressed from "../../assets/stressed.svg";
import excited from "../../assets/exited.svg";
import anxious from "../../assets/anxious.svg";
import tired from "../../assets/tired.svg";
import goals from "../../assets/goals.svg";
import NavBar from "../../components/navBar/navBar";
import CookieConsent from "../../components/cookiesPreferences/Cookies";
import MoodHistory from "../../components/moodHistory/MoodHistory";

const UserDashboardFemale = () => {
  const [userName, setUserName] = useState("");
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [comments, setComments] = useState("");
  const [userId, setUserId] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isMoodLogged, setIsMoodLogged] = useState(false);
  const [isMessageDisplayed, setIsMessageDisplayed] = useState(false);

  const REACT_API_KEY = process.env.REACT_APP_CHAT_API_KEY;

  const moods = [
    { name: "Happy", emoji: happy },
    { name: "Sad", emoji: sad },
    { name: "Stressed", emoji: stressed },
    { name: "Anxious", emoji: anxious },
    { name: "Excited", emoji: excited },
    { name: "Tired", emoji: tired },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const json = await customFetch("GET", "user/me");
        setUserName(json.name);
        setUserId(json._id);

        // Check if the user has logged their mood today
        const today = new Date().toISOString().split("T")[0];
        const lastLoggedDate = localStorage.getItem("moodLoggedDate");

        if (lastLoggedDate !== today) {
          setIsMoodModalOpen(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    loadUserData();
  }, []);

  const closeMoodModal = () => {
    setIsMoodModalOpen(false);
    setMood("");
    setComments("");
    setSuggestions([]);
    setIsMoodLogged(false);
    setIsMessageDisplayed(false);
  };

  const handleMoodClick = async (selectedMood) => {
    setMood(selectedMood);
    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "Act as the best personal trainer and wellness coach.",
            },
            {
              role: "user",
              content: `I am feeling ${selectedMood}. Can you suggest a motivational message for me? Please provide only the message.`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${REACT_API_KEY}`,
          },
        }
      );

      const suggestionText = response.data.choices[0].message.content;
      setSuggestions([{ title: "Motivational Message", content: suggestionText }]);
      setIsMessageDisplayed(true);
    } catch (error) {
      console.error("Error fetching suggestions from ChatGPT:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {


    const data = {
      userId,
      mood,
      suggestions,
      comments,
      date: new Date().toISOString(),
    };

    customFetch("POST", "moodTracker", { body: data })
      .then(() => {
        console.log("Mood logged successfully:", data);

        // Store today's date in localStorage
        const today = new Date().toISOString().split("T")[0];
        localStorage.setItem("moodLoggedDate", today);

        setSuggestions(suggestions)
        setIsMoodLogged(true);

        // If no AI-generated message is requested, close modal immediately
        if (!isMessageDisplayed) {
          closeMoodModal();
        }
      })
      .catch((error) => console.error("Error logging mood:", error));
  };
  console.log(`AI suggestion ${suggestions}`)

  return (
    <div className={styles.container}>
      <NavBar />
      <CookieConsent />
      <Modal isOpen={isMoodModalOpen} isClosed={closeMoodModal}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {!suggestions.length ? (
              <div className={styles.wrapper}>
                <h2>{userName}, How do you feel today?</h2>
                <div className={styles.moods}>
                  {moods.map((item) => (
                    <button
                      key={item.name}
                      className={`${styles.moodButton} ${
                        mood === item.name ? styles.selected : ""
                      }`}
                      onClick={() => handleMoodClick(item.name)}
                    >
                      <img
                        src={item.emoji}
                        alt={item.name}
                        className={`${styles.moodEmoji} ${
                          mood === item.name ? styles.selectedEmoji : ""
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  className={styles.textarea}
                  placeholder="Any additional comments?"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />

                <button
                  className={styles.submitButton}
                  onClick={handleSubmit}
                  disabled={isLoading || isMoodLogged}
                >
                  Submit
                </button>
              </div>
            ) : (
              <>
                <h2>I have a message for you because you are {mood}</h2>
                {isLoading ? (
                  <p>Loading suggestions...</p>
                ) : (
                  suggestions.map((section, index) => (
                    <div key={index} className={styles.suggestionSection}>
                      <h3>{section.title}</h3>
                      <p>{section.content}</p>
                    </div>
                  ))
                )}
                <button className={styles.closeButton} onClick={closeMoodModal}>
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      </Modal>

      <div className={styles.apps}>
        <div>
          <h2>Welcome to your Dashboard {userName}!</h2>
        </div>
        <div className={styles.theWrapper}>
          <Settings />
          <div className={styles.rearrange}>
            <FaseMenstrual />
            <WeekStorical />
            <MacroCalculator />
          </div>
          <div className={styles.smallApps}>
            <div className={styles.save}>
              <MoodHistory />
            </div>
            <div className={styles.save}>
              <button>
                <Link to="/mygoals">
                  <img src={goals} alt="icon" />
                  My Goals
                </Link>
              </button>
            </div>
            <div className={styles.save}>
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
                  My Workouts
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
            <div className={styles.save}>
              <button>
                <Link to="/">
                  <img src={map} alt="icon" />
                  Find a SweatMate
                </Link>
              </button>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default UserDashboardFemale;




