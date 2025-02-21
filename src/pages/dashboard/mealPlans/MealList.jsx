import React, { useState, useEffect } from "react";
import customFetch from "../../../api";
import Card from "../mealPlans/card/Card";
import styles from "../mealPlans/MealPlans.module.css";

const MealList = () => {
  const [mealPlans, setMealPlans] = useState([]); // All meal plans
  const [selectedType, setSelectedType] = useState(""); // Filter type
  const [selectedUser, setSelectedUser] = useState(""); // Selected user
  const [users, setUsers] = useState([]); // User list
  const [selectedPlans, setSelectedPlans] = useState([]); // Selected meal plans

  const mealTypes = [
    "vegan",
    "vegetarian",
    "keto",
    "low-carb",
    "mediterranean",
    "paleo",
    "gluten-free",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch meal plans
        const mealData = await customFetch("GET", "savePrompt");
        setMealPlans(mealData.filter((plan) => plan.infotype === "recipes"));

        // Fetch users
        const userData = await customFetch("GET", "user");
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Corrected Filtering Logic
  const filteredPlans = mealPlans.filter(
    (plan) => selectedType === "" || plan.subCategory === selectedType
  );

  // Toggle Selection Logic
  const togglePlanSelection = (planId) => {
    setSelectedPlans((prev) =>
      prev.includes(planId) ? prev.filter((id) => id !== planId) : [...prev, planId]
    );
  };

  // Send Selected Meal Plans
  const handleSendPlans = () => {
    if (!selectedUser) {
      alert("Please select a user.");
      return;
    }

    if (selectedPlans.length === 0) {
      alert("Please select at least one meal plan.");
      return;
    }

    const payload = selectedPlans.map((planId) => {
      const plan = mealPlans.find((item) => item._id === planId);
      return {
        name: selectedUser,
        infotype: "recipes",
        content: plan.content,
        date: new Date().toISOString(),
        picture: plan.picture,
        subCategory: plan.subCategory,
      };
    });

    customFetch("POST", "mealPlan", { body: payload })
      .then(() => {
        alert("Meal plans assigned successfully!");
        setSelectedPlans([]); // Clear selections
      })
      .catch((error) => {
        console.error("Error assigning meal plans:", error);
        alert("Failed to assign meal plans. Please try again.");
      });
  };

  // Handle Edit Meal Plan
  const handleEditMealPlan = (id, updatedContent) => {
    const updatedMealPlans = mealPlans.map((mealPlan) =>
      mealPlan._id === id ? { ...mealPlan, ...updatedContent } : mealPlan
    );
    setMealPlans(updatedMealPlans);

    // Save to backend
    customFetch("PUT", `savePrompt/${id}`, { body: updatedContent })
      .then(() => {
        console.log("Meal plan updated successfully.");
      })
      .catch((error) => {
        console.error("Error updating meal plan:", error);
      });
  };

  return (
    <div className={styles.container2}>

      {/* User Selection & Send Button */}
      <div className={styles.buttonWrap}>
        <div className={styles.userSelection}>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className={styles.dropdown}
          >
            <option value="">Select a user</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.email}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.sendButton}>
          <button onClick={handleSendPlans}>Send Meal Plan</button>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        {mealTypes.map((type) => (
          <button
            key={type}
            className={`${styles.filterButton} ${selectedType === type ? styles.active : ""}`}
            onClick={() => setSelectedType((prev) => (prev === type ? "" : type))}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Meal Plans Display */}
      <div className={styles.mealPlans}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Card
              key={plan._id}
              item={plan}
              onSelect={() => togglePlanSelection(plan._id)}
              isSelected={selectedPlans.includes(plan._id)}
              onEdit={handleEditMealPlan}
            />
          ))
        ) : (
          <p className={styles.message}>No meal plans available.</p>
        )}
      </div>

    </div>
  );
};

export default MealList;
