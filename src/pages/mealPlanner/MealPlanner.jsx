import React, { useState, useEffect } from "react";
import customFetch from "../../api";
import NavBar from "../../components/navBar/navBar";
import styles from "../../pages/mealPlanner/mealPlanner.module.css";
import Card from "./card/Card"; // Card component for meal plan display


const MealPlanner = () => {
  const [mealPlans, setMealPlans] = useState([]); // Meal plans fetched from the endpoint
  const [user, setUser] = useState(null); // Logged-in user details
  const [name, setName] = useState("");

  // Fetch logged-in user details
  useEffect(() => {
    customFetch("GET", "user/me")
      .then((json) => {
        setUser(json); // Store full user details
        setName(json.name); // Extract user name for display
      })
      .catch((error) => console.error("Error fetching user:", error));
  }, []);

  // Fetch all meal plans assigned to the logged-in user
      useEffect(() => {
         if (!user) return; // Wait until user details are fetched
      
         console.log("Fetching meal plans for userId:", user._id);
      
         customFetch("GET", `mealPlan?userId=${user._id}`)
         .then((json) => {
            console.log("Fetched meal plans:", json);
      
            // Ensure only meal plans for this user are set
            setMealPlans(json.filter((plan) => plan.userName === user._id));
         })
         .catch((error) => console.error("Error fetching meal plans:", error));
      }, [user]);
      
 

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.wrap}>
        <div className={styles.headline}>
          <h3>Your Meal Plans {name}</h3>
        </div>

        {/* Meal Plans Section */}
        <div className={styles.section}>
          <div className={styles.wrapper}>
            {mealPlans.length > 0 ? (
              mealPlans.map((item) => (
                <Card item={item} id={item._id} key={item._id} />
              ))
            ) : (
              <div className={styles.message}>
                <p>You don't have any meal plans assigned yet!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;

// COMPONENT TO RECEIVE THE PT MEAL PLAN