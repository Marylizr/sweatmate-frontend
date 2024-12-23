import React, { useState, useEffect } from 'react';
import customFetch from '../../api';
import styles from './userProfile.module.css';


const SessionsNotes = ({ userId, initialNotes = [] }) => {
  const [sessionNotes, setSessionNotes] = useState(initialNotes);
  const [newNote, setNewNote] = useState('');
  const [showAll, setShowAll] = useState(false);


  // Fetch existing session notes when the component mounts
  useEffect(() => {
    const fetchSessionNotes = async () => {
      try {
        const response = await customFetch('GET', `user/${userId}`);
        if (response.sessionNotes) {
          setSessionNotes(response.sessionNotes);
        }
      } catch (err) {
        console.error('Error fetching session notes:', err);
      }
    };

    if (userId) {
      fetchSessionNotes();
    }
  }, [userId]);

  // Handle input change for new session note
  const handleInputChange = (e) => {
    setNewNote(e.target.value);
  };

  // Handle form submission to add new session note
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) {
      alert('Please enter a session note before saving.');
      return;
    }

    const newNoteEntry = { note: newNote }; // Wrap the new note in an object with 'note' key
    const updatedNotes = [...sessionNotes, newNoteEntry];

    try {
      await customFetch('POST', `user/${userId}/session-notes`, {
        body: JSON.stringify({ session_notes: updatedNotes }),
        headers: { 'Content-Type': 'application/json' },
      });
      setSessionNotes(updatedNotes);
      setNewNote('');
      alert('Session information created');
    } catch (err) {
      console.error('Failed to create session information:', err);
      alert('Failed to update information.');
    }
  };

  // Toggle function for showing all or showing less
  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <div className={styles.sessionForm}>
      <h2>Session Notes</h2>
      <form onSubmit={onSubmit}>
        <div>
          <textarea
            name="newNote"
            value={newNote}
            onChange={handleInputChange}
            placeholder="Enter session note"
          />
        </div>
        <button type="submit" className={styles.submit}>
          Save
        </button>
      </form>

      {/* Display existing session notes with toggle functionality */}
      <div className={styles.notesList}>
        <h3>Existing Session Notes</h3>
        {sessionNotes.length > 0 ? (
          <>
            <ul>
              {(showAll ? sessionNotes : sessionNotes.slice(0, 3)).map((noteObj, index) => (
                <li key={index}>{noteObj.note}</li>
              ))}
            </ul>
            {sessionNotes.length > 3 && (
              <button onClick={toggleShowAll} className={styles.toggleButton}>
                {showAll ? 'Show Less' : 'Show All'}
              </button>
            )}
          </>
        ) : (
          <p>No session notes yet.</p>
        )}
      </div>
    </div>
  );
};

export default SessionsNotes;
