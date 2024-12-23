import React, { useState } from 'react';
import customFetch from '../../api';
import styles from './userProfile.module.css';
import {  useParams } from 'react-router-dom';

const UserPreferences = ({ userId: propUserId, initialPreferences = [] }) => {
  const { id: paramUserId } = useParams();
  const userId = propUserId || paramUserId;
  const [preferences, setPreferences] = useState(initialPreferences);
  const [newPreference, setNewPreference] = useState('');
  const [showAll, setShowAll] = useState(false);


  console.log("User ID:", userId);

  // Handle input change for new preference
  const handleInputChange = (e) => {
    setNewPreference(e.target.value);
  };

  // Handle form submission to add new preference
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newPreference.trim()) {
      alert('Please enter a user preference before saving.');
      return;
    }

    const newPreferenceEntry = { preference: newPreference };
    const updatedPreferences = [...preferences, newPreferenceEntry];

    try {
      await customFetch('POST', `user/${userId}/user-preferences`, {
        body: JSON.stringify({ preferences: updatedPreferences }),
        headers: { 'Content-Type': 'application/json' },
      });
      setPreferences(updatedPreferences);
      setNewPreference('');
      alert('User preferences information created');
    } catch (err) {
      console.error('Failed to create user preferences information:', err);
      alert('Failed to update information.');
    }
  };

  // Toggle function for showing all or showing less
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  if (!userId) {
    return <p>Error: User ID is missing. Cannot save preferences.</p>;
  }

  return (
    <div className={styles.sessionForm}>
      <h2>User's Preferences</h2>
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            name="newPreference"
            value={newPreference}
            onChange={handleInputChange}
            placeholder="Enter user's preferences"
          />
        </div>
        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>

      {/* Display existing user preferences with toggle functionality */}
      <div className={styles.notesList}>
        <h3>Existing User's Preferences</h3>
        {preferences.length > 0 ? (
          <>
            <ul>
              {(showAll ? preferences : preferences.slice(0, 3)).map((prefObj, index) => (
                <li key={index}>{prefObj.preference}</li>
              ))}
            </ul>
            {preferences.length > 3 && (
              <button onClick={toggleShowAll} className={styles.toggleButton}>
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            )}
          </>
        ) : (
          <p>No preferences uploaded yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserPreferences;
