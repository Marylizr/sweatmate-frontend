import React, { useState, useEffect } from 'react';
import customFetch from '../../../api';
import styles from '../nextEvents/nextEvents.module.css';


const Form = () => {
   const [selectedUser, setSelectedUser] = useState('');
   const [newUserName, setNewUserName] = useState('');
   const [newUserEmail, setNewUserEmail] = useState('');
   const [selectAll, setSelectAll] = useState(false);
   const [trainerOnly, setTrainerOnly] = useState(false);
   const [eventType, setEventType] = useState('personal_training');
   const [title, setTitle] = useState('');
   const [date, setDate] = useState('');
   const [duration, setDuration] = useState(60);
   const [location, setLocation] = useState('');
   const [description, setDescription] = useState('');
   const [existingUsers, setExistingUsers] = useState([]);

   useEffect(() => {
      // Fetch existing users to populate dropdown
      const fetchUsers = async () => {
        try {
          const users = await customFetch('GET', 'user');
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
          const createdUser = await customFetch('POST', 'user', { body: newUser });
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
        trainerId: "trainer_id_here", // Replace with trainer's ID from session
        userId: trainerOnly ? null : selectAll ? existingUsers.map(user => user._id) : userId,
        location,
        description
      };
  
      try {
        await customFetch('POST', 'events', { body: newEvent });
        alert('Event successfully created!');
      } catch (err) {
        console.error("Error creating event:", err);
      }
    };
  
  return (
   <div className={styles.inputs}>
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
  )
}

export default Form