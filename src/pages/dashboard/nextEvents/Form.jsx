import React, { useState, useEffect } from 'react';
import fetchResource from '../../../api'; // Assuming fetchResource is imported from the correct path
import styles from './nextEvents.module.css';

const Form = () => {
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

  useEffect(() => {
    // Fetch existing users to populate dropdown
    const fetchUsers = async () => {
      try {
        const users = await fetchResource('GET', 'user');
        if (users.authError) {
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
          return;
        }
        setExistingUsers(users);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

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
        const createdUser = await fetchResource('POST', 'user', { body: newUser });
        if (createdUser.authError) {
          alert('Your session has expired. Please log in again.');
          window.location.href = '/login';
          return;
        }
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
      userId: trainerOnly ? null : selectAll ? existingUsers.map(user => user.name) : selectedUser || userId,
    };

    try {
      // Send the request to create a new event
      const response = await fetchResource('POST', 'events', { body: newEvent });

      if (response.authError) {
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
        return;
      }

      alert('Event successfully created!');
    } catch (err) {
      console.error("Error creating event:", err);
    }
  };

  return (
    <div className={styles.wrap}>
      <h2>Plan Next Events</h2>
      <form onSubmit={handleSubmit} className={styles.styleinput}>
       
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="event-type"> Event Type: </option>
          <option value="personal_training">Personal Training</option>
          <option value="group_class">Group Class</option>
          <option value="gathering">Gathering</option>
        </select>

        <label>Title:</label>
        <input type="text" 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder={`title: ${title}`}
        required />

       
        <input type="datetime-local" 
        onChange={(e) => setDate(e.target.value)} 
        placeholder={`${date}`}
        required />


        <input type="number" 
        onChange={(e) => setDuration(e.target.value)} 
        placeholder={`Duration (minutes): ${duration}`}
        required />


        <input type="text" value={location} 
        placeholder={`Location: ${location}`}
        onChange={(e) => setLocation(e.target.value)} />

        <textarea value={description} 
        placeholder={`Description: ${description}`}
        onChange={(e) => setDescription(e.target.value)} />

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

        <button type="submit" className={styles.submit}>Create Event</button>
      </form>
    </div>
  );
};

export default Form;


// src={meeting.user ? user.image : person} 