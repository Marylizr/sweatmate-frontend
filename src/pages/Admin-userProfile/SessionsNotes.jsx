import React, { useState, useEffect } from 'react';
import fetchResource from '../../api';
import styles from './userProfile.module.css';

const SessionNotes = ({ userId }) => {
  const [sessionNotes, setSessionNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteDate, setNoteDate] = useState('');
  const [showAll, setShowAll] = useState(false); // Toggle for showing more/less history

  // Fetch session notes on component mount
  useEffect(() => {
    const fetchSessionNotes = async () => {
      try {
        const response = await fetchResource('GET', `user/${userId}/session-notes`);
        setSessionNotes(response);
      } catch (err) {
        console.error('Error fetching session notes:', err);
      }
    };

    if (userId) fetchSessionNotes();
  }, [userId]);

  // Add a new session note
  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!newNote || !noteDate) {
      alert('Both note and date are required.');
      return;
    }
  
    const newRecord = { note: newNote, date: noteDate };
    console.log('Sending newRecord:', newRecord);
  
    try {
      const response = await fetchResource('POST', `user/${userId}/session-notes`, {
        body: newRecord,
      });
      setSessionNotes(response.sessionNotes);
      setNewNote('');
      setNoteDate('');
    } catch (err) {
      console.error('Error adding session note:', err);
      alert('Failed to add session note.');
    }
  };

  // Toggle function for showing all or hiding
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className={styles.sessionForm}>
      <h2>Session Notes</h2>
      <form onSubmit={handleAddNote}>
        <textarea
          placeholder="Write about the session"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <input
          type="date"
          value={noteDate}
          onChange={(e) => setNoteDate(e.target.value)}
        />
        <button type="submit">Add Note</button>
      </form>
      <h3>Notes History</h3>
      {sessionNotes.length > 0 ? (
        <>
          <ul>
            {(showAll ? sessionNotes : sessionNotes.slice(0, 0)).map((note, index) => (
              <li key={index}>
                <strong>{new Date(note.date).toLocaleDateString()}</strong>: {note.note}
              </li>
            ))}
          </ul>
          {sessionNotes.length > 0 && (
            <button onClick={toggleShowAll} className={styles.toggleButton}>
              {showAll ? 'Hide History' : 'Show More'}
            </button>
          )}
        </>
      ) : (
        <p>No session notes available.</p>
      )}
    </div>
  );
};

export default SessionNotes;
