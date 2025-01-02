import React, { useState } from 'react';
import styles from './goalForm.module.css'; // Assuming you use CSS modules

const GoalForm = ({ id, onSave }) => {
  const [goalType, setGoalType] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState(0);
  const [milestones, setMilestones] = useState([]);
  const [milestoneValue, setMilestoneValue] = useState('');
  const [measure, setMeasure] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddMilestone = () => {
    if (!milestoneValue) return;
    setMilestones([...milestones, { milestoneValue: Number(milestoneValue) }]);
    setMilestoneValue('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      id,
      goalType,
      targetValue: Number(targetValue),
      measure,
      currentValue: Number(currentValue),
      milestones,
      notes,
    };

    console.log('Payload being sent:', payload);

    onSave(payload);
  };

  return (
    <form onSubmit={handleSubmit} className={styles.container}>
      <label>
        Goal Type:
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
      </label>

      <label>
        Target Value:
        <div className={styles.targetInputGroup}>
          <input
            type="number"
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
      </label>

      <label>
        Current Value (optional):
        <input
          type="number"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
      </label>

      <label>
        Milestones (optional):
        <div className={styles.milestoneInputGroup}>
          <input
            type="number"
            value={milestoneValue}
            onChange={(e) => setMilestoneValue(e.target.value)}
            placeholder="Enter milestone"
          />
          <button type="button" onClick={handleAddMilestone} className={styles.addButton}>
            Add Milestone
          </button>
        </div>
        <ul className={styles.milestoneList}>
          {milestones.map((milestone, index) => (
            <li key={index}>Milestone: {milestone.milestoneValue} {measure}</li>
          ))}
        </ul>
      </label>
       
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add personal insights about your goals"
          className={styles.notesTextarea}
        />
     

      <button type="submit" className={styles.saveButton}>Save Goal</button>
    </form>
  );
};

export default GoalForm;
