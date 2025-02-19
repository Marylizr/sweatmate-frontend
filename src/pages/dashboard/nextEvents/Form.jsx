import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchResource from '../../../api';
import styles from './nextEvents.module.css';
import CustomDropdown from './CustomDropdown';

const Form = ({ refreshEvents }) => {
  const { eventId } = useParams();
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

  const WORKING_HOURS_START = 8;
  const WORKING_HOURS_END = 20;

  const isTimeWithinWorkingHours = (selectedDateTime) => {
    const selectedDate = new Date(selectedDateTime);
    const hours = selectedDate.getHours();
    return hours >= WORKING_HOURS_START && hours < WORKING_HOURS_END;
  };

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

  useEffect(() => {
    if (eventId) {
      const fetchEvent = async () => {
        try {
          const event = await fetchResource('GET', `events/${eventId}`);
          setEventType(event.eventType);
          setTitle(event.title);
          setDate(event.date.split('.')[0]); 
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

    if (!isTimeWithinWorkingHours(date)) {
        alert(`Please select a time between ${WORKING_HOURS_START}:00 and ${WORKING_HOURS_END}:00.`);
        return;
    }

    let usersToAssign = trainerOnly ? [] : selectAll ? existingUsers.map((user) => user._id) : selectedUsers;

    const newEvent = {
        eventType,
        title,
        date,
        duration,
        location,
        description,
        userId: usersToAssign, // Ensure it's an array (even empty for trainerOnly)
        trainerOnly,
        customerEmail: "", // Optional field, ensure it's handled
        status: "pending", // Default value
        confirmationStatus: "not_sent", // Default value
        rescheduleHistory: [] // Initialize empty
    };

    try {
        if (eventId) {
            await fetchResource('PUT', `events/${eventId}`, { body: newEvent });
            alert('Event successfully updated!');
        } else {
            await fetchResource('POST', 'events', { body: newEvent });
            alert('Event successfully created!');
        }

        if (typeof refreshEvents === 'function') {
            refreshEvents();
        }

        navigate('/main/plannextevents');
    } catch (err) {
        console.error('Error creating/updating event:', err);
    }
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

        {!trainerOnly && !selectAll && (
          <div className={styles.dropDown}>
            <CustomDropdown
              users={existingUsers}
              selectedUsers={selectedUsers}
              setSelectedUsers={setSelectedUsers}
            />
          </div>
        )}

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

        <button type="submit" className={styles.submit}>
          {eventId ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default Form;
