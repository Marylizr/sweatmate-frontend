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
    // Fetch meal plans
    customFetch("GET", "savePrompt")
      .then((json) =>
        setMealPlans(
          json.filter((plan) => plan.infotype === "recipes") // Filter for meal plans
        )
      )
      .catch((error) => console.error("Error fetching meal plans:", error));

    // Fetch users
    customFetch("GET", "user")
      .then((json) => setUsers(json))
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  // Filter meal plans by type
  const filteredPlans = mealPlans.filter(
    (plan) => selectedType || plan.subCategory === selectedType
  );

  // Toggle selection
  const togglePlanSelection = (planId) => {
    if (selectedPlans.includes(planId)) {
      setSelectedPlans(selectedPlans.filter((id) => id !== planId));
    } else {
      setSelectedPlans([...selectedPlans, planId]);
    }
  };

  // Send selected meal plans
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

  //handle edit
  const handleEditMealPlan = (id, updatedContent) => {
    // Update the local state
    const updatedMealPlans = mealPlans.map((mealPlan) =>
      mealPlan._id === id ? { ...mealPlan, ...updatedContent } : mealPlan
    );
    setMealPlans(updatedMealPlans);

    // Save to backend
    customFetch("PUT", `savePrompt/${id}`, { body: updatedContent })
      .then(() => {
        console.log("Workout updated successfully in the backend.");
      })
      .catch((error) => {
        console.error("Error updating workout:", error);
      });
  };

  //handle select 
  const handleSelect = (id, isSelected) => {
    if (isSelected) {
      setSelectedPlans((prev) => [...prev, id]); // Add to selected list
    } else {
      setSelectedPlans((prev) => prev.filter((mealPlanId) => mealPlanId !== id)); // Remove from selected list
    }
  };


  return (
    <div className={styles.container2}>

     <div className={styles.buttonWrap}>

          {/* User Selection */}
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

            {/* Send Button */}
          <div className={styles.sendButton}>
            <button  onClick={handleSendPlans}>
              Send MealPlan
            </button>
          </div>
       </div>

      {/* Filter Buttons */}
      <div className={styles.filterButtons}>
        {mealTypes.map((type) => (
          <button
            key={type}
            className={`${styles.filterButton} ${
              selectedType === type ? styles.active : ""
            }`}
            onClick={() => setSelectedType(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Meal Plans */}
      <div className={styles.mealPlans}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map((plan) => (
            <Card
              key={plan._id}
              item={plan}
              onSelect={handleSelect}
              onToggleSelect={togglePlanSelection}
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
