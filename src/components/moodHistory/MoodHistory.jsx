import React, { useEffect, useState } from "react";
import customFetch from "../../api";
import styles from "./moodHistory.module.css";

const MoodHistory = ({ userId }) => {
  const [moodLogs, setMoodLogs] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchMoodLogs = async () => {
      try {
        const logs = await customFetch("GET", `moodTracker/${userId}`);
        setMoodLogs(logs);
      } catch (error) {
        console.error("Error fetching mood logs:", error);
      }
    };

    fetchMoodLogs();
  }, [userId]);

  return (
    <div className={styles.container}>
      <h3>Your Mood History</h3>
      {moodLogs.length === 0 ? (
        <p>No mood logs found.</p>
      ) : (
        <ul>
          {moodLogs.map((log) => (
            <li key={log._id}>
              <strong>{log.mood}</strong> - {log.motivationalMessage || "No message"} ({new Date(log.date).toLocaleDateString()})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodHistory;
