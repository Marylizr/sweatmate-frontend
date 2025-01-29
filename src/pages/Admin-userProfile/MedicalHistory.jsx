import React, { useState, useEffect } from 'react';
import fetchResource from '../../api';
import styles from './userProfile.module.css';

const MedicalHistory = ({ userId }) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [entryDate, setEntryDate] = useState('');
  const [showAll, setShowAll] = useState(false); // Toggle for showing more/less history

  // Fetch medical history on component mount
  useEffect(() => {
    const fetchMedicalHistory = async () => {
      try {
        const response = await fetchResource('GET', `user/${userId}/medical-history`);
        setMedicalHistory(response);
      } catch (err) {
        console.error('Error fetching medical history:', err);
      }
    };

    if (userId) fetchMedicalHistory();
  }, [userId]);

  // Add a new medical history record
  const handleAddEntry = async (e) => {
    e.preventDefault();

    if (!newEntry || !entryDate) {
      alert('Both medical history and date are required.');
      return;
    }
  
    const newRecord = { history: newEntry, date: entryDate };
    console.log('Sending newRecord:', newRecord);
  
    try {
      const response = await fetchResource('POST', `user/${userId}/medical-history`, {
        body: newRecord,
      });
      setMedicalHistory(response.medicalHistory);
      setNewEntry('');
      setEntryDate('');
    } catch (err) {
      console.error('Error adding medical history:', err);
      alert('Failed to add medical history.');
    }
  };

  // Toggle function for showing all or hiding
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className={styles.sessionForm}>
      <h2>Medical History</h2>
      <form onSubmit={handleAddEntry}>
        <textarea
          placeholder="Enter medical history details"
          value={newEntry}
          onChange={(e) => setNewEntry(e.target.value)}
        />
        <div className={styles.bttn}>
          <input
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
          />
          <button type="submit">Add Medical History</button>
        </div>
      </form>
      <h3>Medical History Records</h3>
      {medicalHistory.length > 0 ? (
        <>
          <ul>
            {(showAll ? medicalHistory : medicalHistory.slice(0, 3)).map((entry, index) => (
              <li key={index}>
                <strong>{new Date(entry.date).toLocaleDateString()}</strong>: {entry.history}
              </li>
            ))}
          </ul>
          {medicalHistory.length > 3 && (
            <button onClick={toggleShowAll} className={styles.toggleButton}>
              {showAll ? 'Hide History' : 'Show More'}
            </button>
          )}
        </>
      ) : (
        <p>No medical records available.</p>
      )}
    </div>
  );
};

export default MedicalHistory;
