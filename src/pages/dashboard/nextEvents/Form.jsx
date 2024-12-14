import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchResource from '../../../api'; // Assuming fetchResource is imported from the correct path
import styles from './nextEvents.module.css';

const Form = () => {
  const { eventId } = useParams(); // Get eventId from the URL
  const navigate = useNavigate();

  const [eventType, setEventType] = useState('personal_training');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState();
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [trainerOnly, setTrainerOnly] = useState(false);

  // Fetch existing users to populate the dropdown
  useEffect(() => {
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
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch existing event data if eventId is present (for rescheduling)
  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const event = await fetchResource('GET', `events/${eventId}`);
          setEventType(event.eventType);
          setTitle(event.title);
          setDate(event.date.split('.')[0]); // Format date for input field
          setDuration(event.duration);
          setLocation(event.location);
          setDescription(event.description);
          setTrainerOnly(event.trainerOnly);
          setSelectedUsers(event.userId || []);
        } catch (err) {
          console.error('Error fetching event data:', err);
        }
      };
      fetchEvent();
    }
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let usersToAssign = [];

    if (trainerOnly) {
      usersToAssign = null; // Trainer-only event
    } else if (selectAll) {
      usersToAssign = existingUsers.map(user => user._id); // Assign to all users
    } else if (selectedUsers.length > 0) {
      usersToAssign = selectedUsers; // Assign to selected users
    }

    const newEvent = {
      eventType,
      title,
      date,
      duration,
      location,
      description,
      userId: trainerOnly ? null : usersToAssign,
      trainerOnly,
    };

    try {
      if (eventId) {
        // Update the existing event
        await fetchResource('PUT', `events/${eventId}`, { body: newEvent });
        alert('Event successfully updated!');
      } else {
        // Create a new event
        await fetchResource('POST', 'events', { body: newEvent });
        alert('Event successfully created!');
      }
      navigate('/main/plannextevents'); // Redirect back to the NextEvents page
    } catch (err) {
      console.error('Error creating/updating event:', err);
    }
  };

  const handleUserSelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedUsers(selectedOptions);
  };

  return (
    <div className={styles.wrap}>
      <form onSubmit={handleSubmit} className={styles.styleinput}>
        <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
          <option value="personal_training">Personal Training</option>
          <option value="group_class">Group Class</option>
          <option value="gathering">Gathering</option>
        </select>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Event Title"
          required
        />

        <input
          type="datetime-local"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          required
        />

        <input
          type="text"
          value={location}
          placeholder="Location"
          onChange={(e) => setLocation(e.target.value)}
        />

        <textarea
          className={styles.text}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className={styles.checkboxes}>
          <label>
            <input
              type="checkbox"
              checked={trainerOnly}
              onChange={(e) => {
                setTrainerOnly(e.target.checked);
                if (e.target.checked) {
                  setSelectAll(false);
                  setSelectedUsers([]);
                }
              }}
            />
            PT Only
          </label>

          <label>
            <input
              type="checkbox"
              checked={selectAll}
              onChange={(e) => {
                setSelectAll(e.target.checked);
                if (e.target.checked) {
                  setTrainerOnly(false);
                  setSelectedUsers([]);
                }
              }}
            />
            Select All Users
          </label>
        </div>

        {!trainerOnly && !selectAll && (
          <>
            <label>Select Users:</label>
            <select
              className={styles.selection}
              multiple
              value={selectedUsers}
              onChange={handleUserSelection}
            >
              {existingUsers.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
          </>
        )}

        <button type="submit" className={styles.submit}>
          {eventId ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default Form;
