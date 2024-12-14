import React, { useState, useEffect } from 'react';
import fetchResource from '../../../api';
import styles from '../clientList/clientlist.module.css';
import userIcon from '../../../assets/person_1.svg';
import face from '../../../assets/mood_bad.svg';

const ClientModal = ({ user, activityHistory, setActivityHistory }) => {
  const [lastEvent, setLastEvent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null); // Track selected month


  
  // Fetch today's event specifically for the selected user
  const fetchLastEvent = async () => {
    try {
      const response = await fetchResource('GET', `events?userId=${user._id}`);
  
      if (!response || !Array.isArray(response)) {
        console.error('Invalid response format:', response);
        setLastEvent(null);
        return;
      }
  
      const today = new Date().toISOString().split('T')[0];
      const todayEvent = response.find(
        (event) =>
          event.status === 'pending' &&
          event.userId &&
          event.userId._id === user._id &&
          event.date.split('T')[0] === today
      );
  
      setLastEvent(todayEvent || null);
    } catch (error) {
      console.error("Error fetching today's event:", error);
    }
  };
     
    
    useEffect(() => {
      if (user && user._id) {
        fetchLastEvent();
      }
    }, [user]);

// Fetch activity history for the selected month and user
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
   
         // Fetch events for the selected user and filter by the selected month
         const monthlyEventsResponse = await fetchResource(
            'GET',
            `events?userId=${user._id}&start=${monthStart}&end=${monthEnd}`
         );
   
         // Check if userId is an object, and filter accordingly
         const filteredEvents = monthlyEventsResponse.filter(event => {
            return event.userId._id === user._id; // Ensure the user ID matches correctly
         });
   
         // Sort events by date and update activity history
         setActivityHistory(filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date)));
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

      // Update the activity history with the new status and move the event to history
      setActivityHistory((prevHistory) => [
        { ...lastEvent, status }, // Add the completed/canceled event to history
        ...prevHistory,
      ]);

      // Clear the last event from the current location (will move to history on refresh)
      setLastEvent(null);
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  // Handle month button click: toggle open/close
  const handleMonthClick = (index) => {
    setSelectedMonth(selectedMonth === index ? null : index); // Toggle between opening/closing the month
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <img src={user.image || userIcon} alt={`${user.name}'s profile`} className={styles.modalUserImage} />
        <div className={styles.head}>
          <h2>{user.name}</h2>
          <p>{user.role} Level</p>
        </div>
      </div>

      {/* Display today's event */}
      <div className={styles.currentActivity}>
        <p>{new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' })}</p>
        {lastEvent ? (
          <div>
            <div className={styles.modalstyle}>
              <p><b>Activity: </b>{lastEvent.eventType}</p>
              <p><b>Workout for:</b> {lastEvent.userId.name}</p>
              <p><b>for:</b> {lastEvent.duration} min</p>
              <p><b>at:</b> {new Date(lastEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

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
            
          </div>
        ) : (
          <div>
            <img src={face} alt='emoji' />
            <p>No activities today</p>
          </div>
        )}
      </div>

      {/* Display month buttons */}
      <div className={styles.monthButtons}>
        {[
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ].map((monthName, index) => (
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
                      <p className={styles.time}>
                        {new Date(activity.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' })}
                      </p>
                      <div className={styles.block}>
                        <p>{activity.eventType}</p>
                        <p> at: {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                      <div className={styles.block2}>
                        <p>{activity.duration} min</p>
                        <p>{activity.status || 'Pending'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>
                    <img src={face} alt='emoji' />
                    <p>No activity yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientModal;
