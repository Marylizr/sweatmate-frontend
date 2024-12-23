import React, { useState } from 'react';
import customFetch from '../../api';
import styles from './userProfile.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const MedicalHistory = ({ userId: propUserId, initialMedicalHistory = [] }) => {
  const { id: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const [medicalHistory, setMedicalHistory] = useState(initialMedicalHistory);
  const [newMedicalHistory, setNewMedicalHistory] = useState('');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  console.log("User ID:", userId);

  // Handle input change for new medical history entry
  const handleInputChange = (e) => {
    setNewMedicalHistory(e.target.value);
  };

  // Handle form submission to add new medical history entry
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newMedicalHistory.trim()) {
      alert('Please enter a medical history entry before saving.');
      return;
    }

    const newMedicalHistoryEntry = { entry: newMedicalHistory }; // Wrap new entry in an object
    const updatedMedicalHistory = [...medicalHistory, newMedicalHistoryEntry];

    try {
      await customFetch('POST', `user/${userId}/medical-history`, {
        body: JSON.stringify({ medicalHistory: updatedMedicalHistory }),
        headers: { 'Content-Type': 'application/json' },
      });
      setMedicalHistory(updatedMedicalHistory);
      setNewMedicalHistory('');
      alert('User medical history created');
      navigate('/main/admin-userProfiles');
    } catch (err) {
      console.error('Failed to create user medical history information:', err);
      alert('Failed to update information.');
    }
  };

  // Toggle function for showing all or showing less
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  if (!userId) {
    return <p>Error: User ID is missing. Cannot save medical history.</p>;
  }

  return (
    <div className={styles.sessionForm}>
      <h2>User's Medical History</h2>
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            name="newMedicalHistory"
            value={newMedicalHistory}
            onChange={handleInputChange}
            placeholder="Enter user's medical history"
          />
        </div>
        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>

      {/* Display existing medical history with toggle functionality */}
      <div className={styles.notesList}>
        <h3>Existing User's Medical History</h3>
        {medicalHistory.length > 0 ? (
          <>
            <ul>
              {(showAll ? medicalHistory : medicalHistory.slice(0, 3)).map((entryObj, index) => (
                <li key={index}>{entryObj.entry}</li>
              ))}
            </ul>
            {medicalHistory.length > 3 && (
              <button onClick={toggleShowAll} className={styles.toggleButton}>
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            )}
          </>
        ) : (
          <p>No medical history uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
