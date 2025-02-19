import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import fetchResource from '../../../api';
import styles from './nextEvents.module.css';
import CustomDropdown from './CustomDropdown';

const Form = ({ refreshEvents }) => {
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

  const WORKING_HOURS_START = 8; // 8:00 AM
  const WORKING_HOURS_END = 20; // 8:00 PM

  // Check if the selected time is within working hours
  const isTimeWithinWorkingHours = (selectedDateTime) => {
    const selectedDate = new Date(selectedDateTime);
    const hours = selectedDate.getHours();
    return hours >= WORKING_HOURS_START && hours < WORKING_HOURS_END;
  };

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

  const handleSubmit = async (data) => {
    try {
      const payload = {
        eventType: data.eventType,
        title: data.title,
        date: data.date,
        duration: data.duration,
        location: data.location,
        description: data.description,
        customerEmail: data.customerEmail,
        trainerOnly: trainerOnly,  // Pass the trainerOnly checkbox value
        userId: trainerOnly ? [] : selectedUsers, // If trainerOnly, do not send users
        status: "pending",
        confirmationStatus: "not_sent",
        rescheduleHistory: [],
      };
  
      console.log("Submitting event payload:", payload);
  
      const response = await customFetch("POST", "events", {
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });
  
      if (response.error) {
        console.error("Error creating event:", response.error);
      } else {
        console.log("Event created successfully", response);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
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
