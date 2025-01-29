import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import styles from "./goals.module.css";

const GoalProgressChart = ({ goal, onUpdateProgress }) => {
  const [newValue, setNewValue] = useState("");

  const handleUpdate = () => {
    if (!newValue || isNaN(newValue)) {
      alert("Please enter a valid number for progress.");
      return;
    }

    onUpdateProgress(goal._id, parseFloat(newValue));
    setNewValue(""); // Reset the input
  };

  // Ensure progressHistory has valid data
  const progressData =
    goal.progressHistory?.map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US"), // Format date for display
      value: entry.value,
    })) || [];

  return (
    <div className={styles.chartContainer}>
      <h3 className={styles.chartTitle}>
        {goal.goalType} Goal: {goal.targetValue} {goal.measure}
      </h3>
      {progressData.length > 0 ? (
        <div className={styles.responsiveChart}>
          <ResponsiveContainer width="100%" aspect={4 / 3}>
            <LineChart data={progressData}>
              <defs>
                <linearGradient id="colorLine" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="75%" stopColor="#8884d8" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="#f5f5f5" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#8884d8" />
              <YAxis stroke="#8884d8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#colorLine)"
                strokeWidth={3}
                dot={{
                  stroke: "#8884d8",
                  strokeWidth: 2,
                  fill: "#ffffff",
                }}
                activeDot={{
                  r: 8,
                  fill: "#8884d8",
                  stroke: "#ffffff",
                  strokeWidth: 3,
                }}
                animationDuration={1500}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className={styles.noDataMessage}>
          No progress data available. Start logging progress to see the chart.
        </p>
      )}
      <div className={styles.updateProgress}>
        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Enter new progress"
        />
        <button onClick={handleUpdate}>Update Progress</button>
      </div>
    </div>
  );
};

export default GoalProgressChart;
