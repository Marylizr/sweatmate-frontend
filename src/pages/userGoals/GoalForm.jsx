import React, { useState } from 'react';
import styles from './goalForm.module.css';

const GoalForm = ({ userId, onSave }) => {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [milestones, setMilestones] = useState([]);
  const [milestoneValue, setMilestoneValue] = useState('');
  const [measure, setMeasure] = useState('');
  const [notes, setNotes] = useState('');

  // Add milestone to the list
  const handleAddMilestone = () => {
    if (milestoneValue) {
      setMilestones((prev) => [
        ...prev,
        { milestoneValue: parseFloat(milestoneValue), achievedAt: null }, // No date initially
      ]);
      setMilestoneValue(''); // Reset milestone input field
    }
  };

  // Reset all form fields
  const resetForm = () => {
    setGoalType('');
    setTargetValue('');
    setCurrentValue(0);
    setMilestones([]);
    setMilestoneValue('');
    setMeasure('');
    setNotes('');
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!goalType || !targetValue || !measure) {
      alert("Please fill out all required fields, including the measure.");
      return;
    }
  
    const goal = {
      userId, // This will be renamed to id in the parent component
      goalType,
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue),
      measure, // Include the measure field
      milestones: milestones || [],
      notes,
    };
  
    console.log("Payload being sent:", goal); // Debugging line
  
    onSave(goal); // Pass the goal to the parent component
  
    // Reset form fields
   resetForm()
  };
  
  

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} > 
          <select 
            value={goalType} 
            onChange={(e) => setGoalType(e.target.value)} 
            required
          >
            <option value="">Select a goal type</option>
            <option value="weight">Weight</option>
            <option value="strength">Strength</option>
            <option value="endurance">Endurance</option>
            <option value="custom">Custom</option>
          </select>

     
        <div className={styles.targetInputGroup}>
          <input
            type="number"
            placeholder='Target Value:'
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            required
          />
          <select 
            value={measure} 
            onChange={(e) => setMeasure(e.target.value)} 
            required
          >
            <option value="">Select type</option>
            <option value="kg">Kg</option>
            <option value="km">Km</option>
            <option value="reps">Reps</option>
            <option value="min">Min</option>
          </select>
        </div>
     

       <div className={styles.targetInputGroup}>
          <input
          placeholder=' Current Value'
            type="number"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
           <select 
            value={measure} 
            onChange={(e) => setMeasure(e.target.value)} 
            required
          >
            <option value="">Select type</option>
            <option value="kg">Kg</option>
            <option value="km">Km</option>
            <option value="reps">Reps</option>
            <option value="min">Min</option>
          </select> 
       </div>
          
          <div className={styles.targetInputGroup}>
            <input
              placeholder="Enter milestone"
              type="number"
              value={milestoneValue}
              onChange={(e) => setMilestoneValue(e.target.value)}
            />
            <button type="button" onClick={handleAddMilestone}>
              Add Milestone
            </button>
            <ul className={styles.milestoneList}>
              {milestones.map((milestone, index) => (
                <li key={index}>
                  Milestone: {milestone.milestoneValue} {measure || ''}
                </li>
              ))}
            </ul>
          </div>

      <div className={styles.notesTextarea}>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add personal insights about your goals" 
        />
      </div>


      <button type="submit" className={styles.saveButton}>Save Goal</button>
    </form>
    </div>
  );
};

export default GoalForm;
