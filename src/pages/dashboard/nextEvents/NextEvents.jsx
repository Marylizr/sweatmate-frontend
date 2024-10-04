import React, { useState, useEffect } from 'react';
import customFetch from '../../../api';
import styles from './nextEvents.module.css';

const NextEvents = () => {
  const [eventType, setEventType] = useState('personal_training');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(60);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [selectAll, setSelectAll] = useState(false);
  const [trainerOnly, setTrainerOnly] = useState(false);

  // Get the token from localStorage or other secure storage
  const token = localStorage.getItem('token'); 

  useEffect(() => {
    // Fetch existing users to populate dropdown
    const fetchUsers = async () => {
      try {
        const users = await customFetch('GET', 'user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setExistingUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handle case when the event is for personal trainer only
    let userId = null;
    if (!trainerOnly && !selectAll && eventType === 'personal_training' && newUserName && newUserEmail) {
      // Manually create a new user if not existing
      const newUser = {
        name: newUserName,
        email: newUserEmail,
      };
      try {
        const createdUser = await customFetch('POST', 'user', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: newUser,
        });
        userId = createdUser._id;
      } catch (err) {
        console.error("Error creating new user:", err);
        return;
      }
    }

    // Prepare the event data
    const newEvent = {
      eventType,
      title,
      date,
      duration,
      location,
      description,
    };

    // Add appropriate user IDs to the event data
    if (!trainerOnly) {
      newEvent.userId = selectAll ? existingUsers.map(user => user._id) : userId;
    }

    try {
      // Send the request to create a new event
      await customFetch('POST', 'events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: newEvent,
      });
      alert('Event successfully created!');
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Plan Next Events</h2>
      <form onSubmit={handleSubmit}>
        <label>Event Type:</label>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="personal_training">Personal Training</option>
          <option value="group_class">Group Class</option>
          <option value="gathering">Gathering</option>
        </select>

        <label>Title:</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Date and Time:</label>
        <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} required />

        <label>Duration (minutes):</label>
        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required />

        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

        {eventType === 'personal_training' && (
          <>
            <div className={styles.checkboxes}>
              <label>
                <input
                  type="checkbox"
                  checked={trainerOnly}
                  onChange={(e) => {
                    setTrainerOnly(e.target.checked);
                    if (e.target.checked) {
                      setSelectAll(false);
                      setSelectedUser('');
                      setNewUserName('');
                      setNewUserEmail('');
                    }
                  }}
                />
                Personal Trainer Only
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    if (e.target.checked) {
                      setTrainerOnly(false);
                      setSelectedUser('');
                      setNewUserName('');
                      setNewUserEmail('');
                    }
                  }}
                />
                Select All Users
              </label>
            </div>

            {!trainerOnly && !selectAll && (
              <>
                <label>Select Existing User:</label>
                <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                  <option value="">Select a user...</option>
                  {existingUsers.map((user) => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>

                <label>Or Add New User:</label>
                <input type="text" placeholder="New User Name" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} />
                <input type="email" placeholder="New User Email" value={newUserEmail} onChange={(e) => setNewUserEmail(e.target.value)} />
              </>
            )}
          </>
        )}

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default NextEvents;
