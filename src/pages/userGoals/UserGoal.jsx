import React, { useState, useEffect, useCallback } from "react";
import GoalForm from "./GoalForm";
import MilestoneNotifications from "./MilestoneNotifications";
import GoalProgressChart from "./GoalProgressChart";
import customFetch from "../../api";
import styles from "./goals.module.css";
import NavBar from "../../components/navBar/navBar";

const UserGoal = () => {
  const [goals, setGoals] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [goalsLoading, setGoalsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch logged-in user's information
  const fetchUserData = useCallback(async () => {
    try {
      const response = await customFetch("GET", "user/me");
      setUser(response);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to fetch user data. Please try refreshing the page.");
    }
  }, []);

  // Fetch user goals
  const fetchUserGoals = useCallback(async () => {
    try {
      setGoalsLoading(true);
      if (!user) return [];
      const response = await customFetch("GET", `goals?id=${user._id}`);
      return response || [];
    } catch (error) {
      console.error("Error fetching user goals:", error);
      return [];
    } finally {
      setGoalsLoading(false);
    }
  }, [user]);

  // Load user and goals data on mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await fetchUserData();
      } catch (error) {
        console.error("Error loading user data:", error);
        setError("An error occurred while loading the dashboard.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [fetchUserData]);

  // Load goals whenever user data is available
  useEffect(() => {
    const loadGoals = async () => {
      if (user) {
        try {
          const goalsData = await fetchUserGoals();
          setGoals(goalsData);
        } catch (error) {
          console.error("Error loading user goals:", error);
        }
      }
    };

    loadGoals();
  }, [user, fetchUserGoals]);

  // Save a new goal
  const handleSaveGoal = async (goal) => {
    try {
      const formattedGoal = {
        id: goal.userId,
        goalType: goal.goalType,
        targetValue: goal.targetValue,
        currentValue: goal.currentValue,
        measure: goal.measure, // Include the measure
        milestones: goal.milestones || [],
        personalNotes: goal.notes || [],
      };

      console.log("Payload being sent:", formattedGoal);

      const response = await customFetch("POST", "goals", { body: formattedGoal });

      if (response && response.goal) {
        setGoals((prevGoals) => [...prevGoals, response.goal]);
        alert("Goal saved successfully!");
      } else {
        throw new Error("Failed to save the goal.");
      }
    } catch (error) {
      console.error("Error saving goal:", error);
      alert("An error occurred while saving the goal. Please try again.");
    }
  };

  // Update a milestone
  const handleUpdateMilestone = async (goalId, milestoneValue, updateData) => {
    try {
      await customFetch("PUT", `goals/${goalId}/milestones`, {
        body: { milestoneValue, ...updateData },
      });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === goalId
            ? {
                ...goal,
                milestones: goal.milestones.map((milestone) =>
                  milestone.milestoneValue === milestoneValue
                    ? { ...milestone, ...updateData }
                    : milestone
                ),
              }
            : goal
        )
      );
      alert("Milestone updated successfully!");
    } catch (error) {
      console.error("Error updating milestone:", error);
      alert("Failed to update milestone. Please try again.");
    }
  };

  // Update goal progress
  const handleUpdateProgress = async (goalId, newValue) => {
    try {
      await customFetch("PUT", `goals/${goalId}/progress`, { body: { currentValue: newValue } });
      setGoals((prevGoals) =>
        prevGoals.map((goal) =>
          goal._id === goalId ? { ...goal, currentValue: newValue } : goal
        )
      );
      alert("Progress updated successfully!");
    } catch (error) {
      console.error("Error updating progress:", error);
      alert("Failed to update progress. Please try again.");
    }
  };

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorMessage}>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!user) {
    return <p>No user data found. Please log in again.</p>;
  }

  return (
    <div className={styles.mainContainer}>
      <NavBar />
      <div className={styles.container}>
      <div>
        <h2>Hey {user.name}, let's set some goals!</h2>
      </div>

        <div className={styles.wrapSection}>
          <div className={styles.section}>
            <h2>Your Goals</h2>
            <GoalForm userId={user._id} onSave={handleSaveGoal} />
          </div>
          <div className={styles.section}>
            <h2>Milestones</h2>
            {goalsLoading ? (
              <p>Loading milestones...</p>
            ) : (
              <MilestoneNotifications
                goals={goals}
                onUpdateMilestone={handleUpdateMilestone}
              />
            )}
          </div>
          </div>
          <div className={styles.progresses}>
            <div className={styles.goalSection}>
              <h2>Progress</h2>
              <div className={styles.chartStyle}>
                {goals.map((goal) => (
                  <GoalProgressChart key={goal._id} goal={goal} 
                  onUpdateProgress={handleUpdateProgress}
                  />
                ))}
              </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserGoal;
