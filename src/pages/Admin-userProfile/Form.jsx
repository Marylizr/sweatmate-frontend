import React, { useState } from 'react';
import styles from './userProfile.module.css';
import customFetch from '../../api';
import eye from '../../assets/eye.svg';


const Form = ({ selectedItem, onUpdate }) => {

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => setPasswordShown(!passwordShown);

    const [getUser, setGetUser] = useState({
      name: selectedItem.name,
      email: selectedItem.email,
      age: selectedItem.age,
      height: selectedItem.height,
      weight: selectedItem.weight,
      goal: selectedItem.goal,
      password: "", // Initialize with an empty string for security
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setGetUser(prev => ({ ...prev, [name]: value }));
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      console.log("Updating user ID:", selectedItem._id); // Confirm the correct ID is used
    
      const updateData = { ...getUser };
      if (!updateData.password) {
        delete updateData.password;
      }
    
      try {
        await customFetch("PUT", `user/${selectedItem._id}`, { body: updateData });
        onUpdate(updateData);
        alert("Information Updated");
        window.location.reload(); // Refresh the page to see immediate updates
      } catch (err) {
        console.error("Failed to update information:", err);
        alert("Failed to update information.");
      }
    };
    

  return (
    <div className={styles.wrap_form}>
      <p>Edit {selectedItem.name}’s Profile</p>

      <form onSubmit={onSubmit}>
        <div className={styles.namesinput}>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={getUser.name}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.namesinput}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={getUser.email}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.namesinput}>
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={getUser.age}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.namesinput}>
          <label>Height</label>
          <input
            type="number"
            name="height"
            value={getUser.height}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.namesinput}>
          <label>Weight</label>
          <input
            type="number"
            name="weight"
            value={getUser.weight}
            onChange={handleInputChange}
          />
        </div>

        <div className={styles.namesinput}>
          <label>Goal</label>
          <select
            name="goal"
            value={getUser.goal}
            onChange={handleInputChange}
          >
            <option value="Fat-Lost">Fat Lost</option>
            <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <div className={styles.namesinput}>
          <label>Password</label>
          <input
            type={passwordShown ? "text" : "password"}
            name="password"
            placeholder="Enter a new password"
            value={getUser.password}
            onChange={handleInputChange}
          />
           <i className={styles.eye} onClick={togglePasswordVisibility}>
              <img src={eye} alt="eye-icon" />
          </i>
        </div>

        <button type="submit" className={styles.submit}>Save</button>
      </form>
    </div>
  );
};

export default Form;
