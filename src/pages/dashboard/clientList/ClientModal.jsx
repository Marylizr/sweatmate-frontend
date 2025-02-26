import React, { useState, useEffect, useCallback } from 'react';
import fetchResource from '../../../api';
import styles from '../clientList/clientlist.module.css';
import userIcon from '../../../assets/person_1.svg';
import face from '../../../assets/mood_bad.svg';

const ClientModal = ({ user, activityHistory, setActivityHistory }) => {
  const [lastEvent, setLastEvent] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const fetchLastEvent = useCallback(async () => {
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
          event.userId.some((u) => u._id === user._id) &&
          event.date.split('T')[0] === today
      );

      setLastEvent(todayEvent || null);
    } catch (error) {
      console.error("Error fetching today's event:", error);
    }
  }, [user._id]);

  useEffect(() => {
    if (user && user._id) {
      fetchLastEvent();
    }
  }, [user, fetchLastEvent]);

  useEffect(() => {
    if (selectedMonth === null) {
      setActivityHistory([]);
      return;
    }

    const fetchActivityHistory = async () => {
      try {
        const year = new Date().getFullYear();
        const monthStart = new Date(year, selectedMonth, 1).toISOString();
        const monthEnd = new Date(year, selectedMonth + 1, 0, 23, 59, 59).toISOString();

        const monthlyEventsResponse = await fetchResource(
          'GET',
          `events?userId=${user._id}&start=${monthStart}&end=${monthEnd}`
        );

        const filteredEvents = monthlyEventsResponse.filter((event) =>
          event.userId.some((u) => u._id === user._id)
        );

        setActivityHistory(
          filteredEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
        );
      } catch (error) {
        console.error('Error fetching activity history:', error);
      }
    };

    fetchActivityHistory();
  }, [selectedMonth, user._id]);

  const handleStatusChange = async (status) => {
    if (!lastEvent) return;

    try {
      await fetchResource('PUT', `events/${lastEvent._id}`, { body: { status } });

      setActivityHistory((prevHistory) => [
        { ...lastEvent, status },
        ...prevHistory,
      ]);

      setLastEvent(null);
    } catch (error) {
      console.error('Error updating event status:', error);
    }
  };

  const handleMonthClick = (index) => {
    setSelectedMonth(selectedMonth === index ? null : index);
  };

  return (
    <div className={styles.modalContainer}>
      <div className={styles.modalHeader}>
        <img
          src={user.image || userIcon}
          alt={`${user.name}'s profile`}
          className={styles.modalUserImage}
        />
        <div className={styles.head}>
          <h2>{user.name}</h2>
          <p>{user.role} Level</p>
        </div>
      </div>

      <div className={styles.currentActivity}>
        <p>
          {new Date().toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'numeric',
          })}
        </p>
        {lastEvent ? (
          <div>
            <div className={styles.modalstyle}>
              <p><b>Activity:</b> {lastEvent.eventType}</p>
              <p><b>Workout for:</b> {lastEvent.userId.name}</p>
              <p><b>for:</b> {lastEvent.duration} min</p>
              <p><b>at:</b> {new Date(lastEvent.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>

            <div className={styles.radioButtons}>
              <label>
                <input type="radio" name="status" value="completed" onChange={() => handleStatusChange('completed')} /> Completed
              </label>
              <label>
                <input type="radio" name="status" value="canceled" onChange={() => handleStatusChange('canceled')} /> Canceled
              </label>
            </div>
          </div>
        ) : (
          <div>
            <img src={face} alt="emoji" />
            <p>No activities today</p>
          </div>
        )}
      </div>

      <div className={styles.monthButtons}>
        {[
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December',
        ].map((monthName, index) => (
          <div key={index}>
            <button className={index === selectedMonth ? styles.selectedMonth : ''} onClick={() => handleMonthClick(index)}>
              {monthName}
            </button>

            {selectedMonth === index && (
              <div className={styles.activityHistory}>
                {activityHistory.length > 0 ? (
                  <table className={styles.historyTable}>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Activity</th>
                        <th>Time</th>
                        <th>Duration</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityHistory.map((activity, i) => (
                        <tr key={i}>
                          <td>{new Date(activity.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'numeric' })}</td>
                          <td>{activity.eventType}</td>
                          <td>{new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td>{activity.duration} min</td>
                          <td>{activity.status || 'Pending'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <img src={face} alt="emoji" />
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
};

export default ClientModal;
