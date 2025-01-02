import React, { useState, useEffect } from 'react';
import fetchResource from '../../api';
import styles from './userProfile.module.css';

const UserPreferences = ({ userId }) => {
  const [preferences, setPreferences] = useState([]);
  const [newPreference, setNewPreference] = useState('');
  const [preferenceDate, setPreferenceDate] = useState('');
  const [showAll, setShowAll] = useState(false); // Toggle for showing more/less history

  // Fetch user preferences on component mount
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const response = await fetchResource('GET', `user/${userId}/user-preferences`);
        setPreferences(response);
      } catch (err) {
        console.error('Error fetching user preferences:', err);
      }
    };

    if (userId) fetchPreferences();
  }, [userId]);

  // Add a new user preference
  const handleAddPreference = async (e) => {
    e.preventDefault();

    if (!newPreference || !preferenceDate) {
      alert('Both preference and date are required.');
      return;
    }
  
    const newRecord = { preference: newPreference, date: preferenceDate };
    console.log('Sending newRecord:', newRecord);
  
    try {
      const response = await fetchResource('POST', `user/${userId}/user-preferences`, {
        body: newRecord,
      });
      setPreferences(response.preferences);
      setNewPreference('');
      setPreferenceDate('');
    } catch (err) {
      console.error('Error adding user preference:', err);
      alert('Failed to add user preference.');
    }
  };

  // Toggle function for showing all or hiding
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className={styles.sessionForm}>
      <h2>User Preferences</h2>
      <form onSubmit={handleAddPreference}>
        <textarea
          placeholder="Enter user preference details"
          value={newPreference}
          onChange={(e) => setNewPreference(e.target.value)}
        />
        <input
          type="date"
          value={preferenceDate}
          onChange={(e) => setPreferenceDate(e.target.value)}
        />
        <button type="submit">Add Preference</button>
      </form>
      <h3>Preferences History</h3>
      {preferences.length > 0 ? (
        <>
          <ul>
            {(showAll ? preferences : preferences.slice(0, 3)).map((pref, index) => (
              <li key={index}>
                <strong>{new Date(pref.date).toLocaleDateString()}</strong>: {pref.preference}
              </li>
            ))}
          </ul>
          {preferences.length > 3 && (
            <button onClick={toggleShowAll} className={styles.toggleButton}>
              {showAll ? 'Hide History' : 'Show More'}
            </button>
          )}
        </>
      ) : (
        <p>No user preferences available.</p>
      )}
    </div>
  );
};

export default UserPreferences;
