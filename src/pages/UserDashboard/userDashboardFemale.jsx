import React, { useState, useEffect } from "react";
import styles from "./settings.module.css";
import NavBar from "../../components/navBar/navBar";
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
import Modal from './Modal/Modal';
import axios from 'axios';

const UserDashboardFemale = () => {
  const [name, setName] = useState("");
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(false);
  const [mood, setMood] = useState("");
  const [comments, setComments] = useState("");
  const [userName, setUserName] = useState("");
  const [suggestions, setSuggestions] = useState([]); // Changed from null to []
  const [isLoading, setIsLoading] = useState(false);

  const moods = ["Happy", "Sad", "Stressed", "Anxious", "Excited", "Tired"];

  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setName(json.name);
        setUserName(json._id);
        setIsMoodModalOpen(true);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const closeMoodModal = () => {
    setIsMoodModalOpen(false);
    setMood("");
    setComments("");
    setSuggestions([]);
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
              content: `I am feeling ${selectedMood}. Can you suggest a motivational message for me?, please give me directly the message`,
            },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer `, // Add your API key here
          },
        }
      );

      const suggestionText = response.data.choices[0].message.content;

      // Parse the ChatGPT response into sections
      const formattedSuggestions = formatSuggestions(suggestionText);
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error("Error fetching suggestions from ChatGPT:", error);
      setSuggestions([]); // Ensure suggestions is reset to an empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!mood) return alert("Please select a mood!");
    if (!userName) return alert("User information is missing. Please try again later.");

    const data = {
      name,
      mood,
      comments,
      date: new Date().toISOString(),
    };

    customFetch("POST", "moodTracker", { body: data })
      .then(() => {
        console.log("Mood logged successfully:", data);
      })
      .catch((error) => console.error("Error logging mood:", error));
  };

  const formatSuggestions = (text) => {
    const sections = text.split("\n\n");
    const formatted = sections.map((section, index) => {
      const titleMatch = section.match(/^(.+?):/); // Extract section title (e.g., "Workout:")
      const title = titleMatch ? titleMatch[1] : ` ${index + 1}`;
      const content = section.replace(/^.+?:\s*/, ""); // Remove the title from the content
      return { title, content };
    });
    return formatted;
  };

  return (
    <div className={styles.container}>
      <NavBar />

      <Modal isOpen={isMoodModalOpen} isClosed={closeMoodModal}>
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            {!suggestions.length ? (
              <div className={styles.wrapper}>
                <h2>{name}, How do you feel today?</h2>
                <div className={styles.moods}>
                  {moods.map((item) => (
                    <button
                      key={item}
                      className={`${styles.moodButton} ${mood === item ? styles.selected : ""}`}
                      onClick={() => handleMoodClick(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <textarea
                  placeholder="Any additional comments?"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className={styles.moods}
                />
                <button className={styles.submitButton} onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            ) : (
              <>
                <h2>I have a message for you because you are {mood}</h2>
                {isLoading ? (
                  <p>Loading suggestions...</p>
                ) : (
                  Array.isArray(suggestions) && suggestions.map((section, index) => (
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

      <div>
        <h2>Welcome to your Dashboard {name}!</h2>
      </div>
      <div className={styles.apps}>
        <Settings />
        <div className={styles.rearrange}>
          <FaseMenstrual />
          <WeekStorical />
          <MacroCalculator />
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
                my WorkOuts
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/">
                <img src={map} alt="icon" />
                find a SweatMate
              </Link>
            </button>
          </div>
          <div className={styles.save}>
            <button>
              <Link to="/progress">
                <img src={donut} alt="icon" />
                my Progress
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

export default UserDashboardFemale;
