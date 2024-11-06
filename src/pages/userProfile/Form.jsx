import React, { useState } from 'react';
import styles from './userProfile.module.css';
import customFetch from '../../api';

const Form = ({ selectedItem, onUpdate }) => {
  const [getUser, setGetUser] = useState({
    name: selectedItem.name,
    email: selectedItem.email,
    age: selectedItem.age,
    height: selectedItem.height,
    weight: selectedItem.weight,
    goal: selectedItem.goal,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGetUser(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("Updating user ID:", selectedItem._id); // Confirm the correct ID is used

    try {
      // Ensure the correct user ID is used for the update
      await customFetch("PUT", `user/${selectedItem._id}`, { body: getUser });
      onUpdate(getUser); // Call onUpdate to update the local state in UserProfile
      window.location.reload(); // Refresh the page to see immediate updates
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  return (
    <div className={styles.wrap_form}>
      <p>Edit {selectedItem.name}’s Profile</p>
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.namesinput}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={getUser.name}
            onChange={handleInputChange}
            className={styles.names}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={getUser.email}
            onChange={handleInputChange}
            className={styles.email}
          />
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={getUser.age}
            onChange={handleInputChange}
            className={styles.names}
          />
          <label>Height</label>
          <input
            type="number"
            name="height"
            value={getUser.height}
            onChange={handleInputChange}
            className={styles.names}
          />
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={getUser.weight}
            onChange={handleInputChange}
            className={styles.names}
          />
          <label>Goal</label>
          <select
            name="goal"
            value={getUser.goal}
            onChange={handleInputChange}
            className={styles.names}
          >
            <option value="Fat-Lost">Fat Lost</option>
            <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
            <option value="Maintenance">Maintenance</option>
          </select>  
        </div>
        <button type="submit" className={styles.submit}>Save</button>
      </form> 
    </div>
  );
};

export default Form;
