import React, { useState, useEffect } from "react";
import styles from "../predesignWorkout/predesignworkout.module.css";
import Card from "./card/Card";
import customFetch from "../../../api";

const PreDesigned = () => {
  const [designWorkout, setDesignWorkout] = useState([]); // Stores all workouts
  const [selectedLevel, setSelectedLevel] = useState(""); // Selected workout level
  const [selectedUser, setSelectedUser] = useState(""); // Selected user email
  const [users, setUsers] = useState([]); // List of users
  const [selectedWorkouts, setSelectedWorkouts] = useState([]); // Selected workouts

  useEffect(() => {
    // Fetch workouts
    customFetch("GET", "savePrompt")
      .then((json) => {
        // Add a default value for content if it's missing or not a string
        const validWorkouts = json.map((workout) => ({
          ...workout,
          content: typeof workout.content === "string" ? workout.content : "No content available",
        }));
        setDesignWorkout(validWorkouts);
      })
      .catch((error) => console.error("Error fetching workouts:", error));

    // Fetch users
    customFetch("GET", "user")
      .then((json) => setUsers(json))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Filter workouts by selected level
  const filteredWorkouts = designWorkout.filter(
    (item) => item.infotype === "workouts" && item.subCategory === selectedLevel
  );

  // Toggle workout selection
  const toggleWorkoutSelection = (workout) => {
    if (selectedWorkouts.some((w) => w === workout._id)) {
      // Remove the workout ID if it's already selected
      setSelectedWorkouts(selectedWorkouts.filter((w) => w !== workout._id));
    } else {
      // Add the workout ID if it's not selected
      setSelectedWorkouts([...selectedWorkouts, workout._id]);
    }
  };
  

  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedWorkouts((prev) => [...prev, id]); // Add to selected list
    } else {
      setSelectedWorkouts((prev) => prev.filter((workoutId) => workoutId !== id)); // Remove from selected list
    }
  };

  // Handle workout editing
  const handleEditWorkout = (id, updatedContent) => {
    // Update the local state
    const updatedWorkouts = designWorkout.map((workout) =>
      workout._id === id ? { ...workout, ...updatedContent } : workout
    );
    setDesignWorkout(updatedWorkouts);

    // Save to backend
    customFetch("PUT", `savePrompt/${id}`, { body: updatedContent })
      .then(() => {
        console.log("Workout updated successfully in the backend.");
      })
      .catch((error) => {
        console.error("Error updating workout:", error);
      });
  };

  // Send selected workouts to the selected user
  const handleSendWorkouts = () => {
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }
  
    if (selectedWorkouts.length === 0) {
      alert("Please select at least one workout.");
      return;
    }
  
    const payload = selectedWorkouts.map((workoutId) => {
      const workout = designWorkout.find((item) => item._id === workoutId);
  
      if (!workout) {
        console.warn(`Workout with ID ${workoutId} not found in designWorkout.`);
        return null; // Skip invalid workouts
      }
  
      return {
        userName: selectedUser,
        infotype: "workouts",
        content: workout.content || "No content available",
        date: new Date().toISOString(),
        picture: workout.picture || "https://via.placeholder.com/150",
        subCategory: workout.subCategory || "basic",
      };
    }).filter((item) => item !== null); // Remove null entries
  
    if (payload.length === 0) {
      alert("No valid workouts to assign.");
      return;
    }
  
    console.log("Payload sent to /preWorkout:", payload);
  
    customFetch("POST", "preWorkout", { body: payload })
      .then(() => {
        alert("Workouts assigned successfully!");
        setSelectedWorkouts([]); // Clear selected workouts
      })
      .catch((error) => {
        console.error("Error assigning workouts:", error);
        alert("Failed to assign workouts. Please try again.");
      });
  };
  

  return (
    <div className={styles.container2}>
      {/* User Selection */}
      <div className={styles.buttonWrap}>
        <div className={styles.userSelection}>
          <select
            className={styles.dropdown}
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          {/* Send Button */}
          <button className={styles.sendButton} onClick={handleSendWorkouts}>
            Send Workout
          </button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        <button
          className={`${styles.filterButton} ${
            selectedLevel === "basic" ? styles.active : ""
          }`}
          onClick={() => setSelectedLevel("basic")}
        >
          Basic Level
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedLevel === "medium" ? styles.active : ""
          }`}
          onClick={() => setSelectedLevel("medium")}
        >
          Medium Level
        </button>
        <button
          className={`${styles.filterButton} ${
            selectedLevel === "advanced" ? styles.active : ""
          }`}
          onClick={() => setSelectedLevel("advanced")}
        >
          Advanced Level
        </button>
      </div>

      {/* Display Workouts */}
      <div className={styles.workouts}>
        {selectedLevel ? (
          filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((item) => (
              <div
                key={item._id}
                onClick={() => toggleWorkoutSelection(item)}
                className={`${styles.card} ${
                  selectedWorkouts.some((w) => w._id === item._id)
                    ? styles.selected
                    : ""
                }`}
              >
                <Card
                  item={item}
                  onEdit={handleEditWorkout}
                  onSelect={handleSelect}
                />
              </div>
            ))
          ) : (
            <p className={styles.emptyState}>
              No workouts available for {selectedLevel} level.
            </p>
          )
        ) : (
          <p className={styles.emptyState}>Select a level to view workouts.</p>
        )}
      </div>
    </div>
  );
};

export default PreDesigned;
