import React, { useState, useEffect } from 'react';
import styles from './userProfile.module.css';
import customFetch from '../../api';
import eye from '../../assets/eye.svg';
import { useNavigate } from 'react-router-dom';

const Form = ({ selectedItem, onUpdate, trainers }) => {
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => setPasswordShown(!passwordShown);
  const navigate = useNavigate();

  const [getUser, setGetUser] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    goal: '',
    password: '',
    fitness_level: '',
    trainerId: '', // Added trainerId
    medical_history: '',
    preferences: '',
    session_notes: [],
  });

  // Populate getUser when selectedItem is available
  useEffect(() => {
    if (selectedItem) {
      setGetUser({
        name: selectedItem.name || '',
        email: selectedItem.email || '',
        age: selectedItem.age || '',
        height: selectedItem.height || '',
        weight: selectedItem.weight || '',
        goal: selectedItem.goal || '',
        password: '', // For security reasons, don't pre-fill the password
        fitness_level: selectedItem.fitness_level || '',
        trainerId: selectedItem.trainerId || '', // Pre-fill trainerId
        medical_history: selectedItem.medical_history || '',
        preferences: selectedItem.preferences || '',
        session_notes: selectedItem.session_notes || [],
      });
    }
  }, [selectedItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGetUser((prev) => ({
      ...prev,
      [name]: name === 'session_notes' ? value.split('\n') : value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Updating user ID:', selectedItem._id); // Confirm the correct ID is used

    const updateData = { ...getUser };
    if (!updateData.password) {
      delete updateData.password;
    }

    try {
      await customFetch('PUT', `user/${selectedItem._id}`, { body: updateData });
      onUpdate(updateData);
      alert("User's Information Updated");
      navigate('/main/edituserprofile/:id');
    } catch (err) {
      console.error('Failed to update information:', err);
      alert('Failed to update information.');
    }
  };

  return (
    <div className={styles.namesinput}>
      <form onSubmit={onSubmit}>
        <label>Name</label>
        <input type="text" name="name" value={getUser.name} onChange={handleInputChange} />

        <label>Email</label>
        <input type="email" name="email" value={getUser.email} onChange={handleInputChange} />

        {/* Password Field */}
        <div className={styles.pass}>
          <input
            type={passwordShown ? 'text' : 'password'}
            name="password"
            placeholder="Enter a new password"
            value={getUser.password}
            onChange={handleInputChange}
          />
          <button type="button" className={styles.eye} onClick={togglePasswordVisibility}>
            <img src={eye} alt="eye-icon" />
          </button>
        </div>

        <label>Age</label>
        <input type="number" name="age" value={getUser.age} onChange={handleInputChange} />
       
        <label>Height</label>
        <input type="number" name="height" value={getUser.height} onChange={handleInputChange} />
        
        <label>Weight</label>
        <input type="number" name="weight" value={getUser.weight} onChange={handleInputChange} />
        
        <label>Goal</label>
        <select name="goal" value={getUser.goal} onChange={handleInputChange}>
          <option value="Fat-Lost">Fat Lost</option>
          <option value="Gain-Muscle-Mass">Gain Muscle Mass</option>
          <option value="Maintenance">Maintenance</option>
        </select>
    
        <label>Fitness Level</label>
        <select name="fitness_level" value={getUser.fitness_level} onChange={handleInputChange}>
          <option value="">Select Fitness Level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {/* Trainer ID Field */}
        <label>Assigned Trainer</label>
        <select name="trainerId" value={getUser.trainerId} onChange={handleInputChange}>
          <option value="">Select a Trainer</option>
          {trainers &&
            trainers.map((trainer) => (
              <option key={trainer._id} value={trainer._id}>
                {trainer.name}
              </option>
            ))}
        </select>
      
        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>
    </div>
  );
};

export default Form;
