import React, { useState, useEffect } from 'react';
import styles from './clientlist.module.css'; // Custom CSS module
import fetchResource from '../../../api'; // Assuming fetchResource is available for API calls
import userIcon from '../../../assets/person_1.svg'; // Placeholder user image
import ChevronIcon from '../../../assets/chevron.svg'; // Chevron icon for expanding user info

// Client List Component
const ClientList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // For modal control
  const [showModal, setShowModal] = useState(false); // Control modal visibility

  // Fetch user data
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await fetchResource('GET', 'user');
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);
  

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
    fetchUserEvents(user._id); // Fetch and display only this user's events
  };
  

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  return (
    <div className={styles.container}>
      <h2>Client List</h2>
      <div className={styles.userList}>
        {users.map((user) => (
          <div key={user._id} className={styles.userItem} onClick={() => openModal(user)}>
            <img src={user.image || userIcon} alt={`${user.name}'s profile`} className={styles.userImage} />
            <div className={styles.userDetails}>
              <p className={styles.userName}>{user.name}</p>
              <p className={styles.userLevel}>{user.role} Level</p>
            </div>
            <img src={ChevronIcon} alt="View details" className={styles.chevronIcon} />
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <ClientActivityModal user={selectedUser} closeModal={closeModal} />
      )}
    </div>
  );
};

// User Activity Modal Component renamed to `ClientActivityModal`
const ClientActivityModal = ({ user, closeModal }) => {
  const [lastEvent, setLastEvent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month
  const [activityHistory, setActivityHistory] = useState([]); // Activity history for the selected month

  // Fetch events specifically for the selected user
  useEffect(() => {
    const fetchLastEvent = async () => {
      try {
        const response = await fetchResource('GET', `events?userId=${user._id}`);
        // Ensure that we are only getting events for the correct `userId`
        if (response.length > 0) {
          setLastEvent(response[0]); // Set today's event
        } else {
          setLastEvent(null); // No event for today
        }
      } catch (error) {
        console.error('Error fetching today\'s event:', error);
      }
    };

    fetchLastEvent();
  }, [user._id]); // Fetch only for the selected user

  // Fetch activity history for the selected month
  useEffect(() => {
    if (selectedMonth === null) {
      setActivityHistory([]); // Reset activity history if no month is selected
      return;
    }

    const fetchActivityHistory = async () => {
      try {
        const year = new Date().getFullYear();
        const monthStart = new Date(year, selectedMonth, 1).toISOString();
        const monthEnd = new Date(year, selectedMonth + 1, 0, 23, 59, 59).toISOString();

        // Fetch events specifically for the selected user within the selected month
        const monthlyEventsResponse = await fetchResource('GET', `events?userId=${user._id}&start=${monthStart}&end=${monthEnd}`);
        
        // Filter and sort events by date
        const filteredEvents = monthlyEventsResponse.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate >= new Date(monthStart) && eventDate <= new Date(monthEnd);
        });

        setActivityHistory(filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date))); // Sort by date
      } catch (error) {
        console.error('Error fetching activity history:', error);
      }
    };

    fetchActivityHistory();
  }, [selectedMonth, user._id]); // Fetch only for the selected user and month

 // Handle status change for the last event (completed or canceled)
const handleStatusChange = async (status) => {
  if (!lastEvent) return;

  try {
    // Update the event's status in the database
    await fetchResource('PUT', `events/${lastEvent._id}`, { body: { status } });

    // Update the activity history with the new status
    setActivityHistory((prevHistory) =>
      prevHistory.map((activity) =>
        activity._id === lastEvent._id ? { ...activity, status } : activity
      )
    );

    // Clear the last event from the current location
    setLastEvent(null);
  } catch (error) {
    console.error('Error updating event status:', error);
  }
};

  // Handle month button click: toggle open/close
  const handleMonthClick = (index) => {
    setSelectedMonth(selectedMonth === index ? null : index); // Toggle between opening/closing the month
  };

  // Fetch user-specific events
const fetchUserEvents = async (userId) => {
  try {
    const events = await fetchResource('GET', `events?userId=${userId}`); // Fetch events specific to this user
    setActivityHistory(events);
  } catch (error) {
    console.error('Error fetching user events:', error);
  }
};


  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <img src={user.image || userIcon} alt={`${user.name}'s profile`} className={styles.modalUserImage} />
        <div>
          <h2>{user.name}</h2>
          <p>{user.role} Level</p>
        </div>
        <button onClick={closeModal} className={styles.closeButton}>X</button>
      </div>

      {/* Display today's event */}
      <div className={styles.currentActivity}>
        <p>{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' })}</p>
        {lastEvent ? (
          <>
            <p>{lastEvent.eventType}</p>
            <p>{lastEvent.duration} min</p>
            <p>{new Date(lastEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <div className={styles.radioButtons}>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="completed"
                  onChange={() => handleStatusChange('completed')}
                /> Completed
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="canceled"
                  onChange={() => handleStatusChange('canceled')}
                /> Canceled
              </label>
            </div>
          </>
        ) : (
          <p>No activities today</p>
        )}
      </div>

      {/* Display month buttons */}
      <div className={styles.monthButtons}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((monthName, index) => (
          <div key={index}>
            <button
              className={index === selectedMonth ? styles.selectedMonth : ''}
              onClick={() => handleMonthClick(index)} // Toggle the month selection
            >
              {monthName}
            </button>

            {selectedMonth === index && ( // If the month is selected, display its events
              <div className={styles.activityHistory}>
                {activityHistory.length > 0 ? (
                  activityHistory.map((activity, i) => (
                    <div key={i} className={styles.historyItem}>
                      <p>{new Date(activity.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' })}</p>
                      <p>{activity.eventType}</p>
                      <p>{activity.duration} min</p>
                      <p>{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p>{activity.status || 'Pending'}</p>
                    </div>
                  ))
                ) : (
                  <p>No activity yet</p> // Show "No activity yet" for months without data
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
