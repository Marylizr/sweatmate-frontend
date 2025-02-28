import React, { useState, useEffect } from 'react';
import fetchResource from '../../../api'; // Assume fetchResource is available for API calls
import styles from './upcomingmeetings.module.css'; // Custom CSS module
import person from '../../../assets/person_1.svg';

const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [showAll, setShowAll] = useState(false);

  // Fetch upcoming meetings from the events endpoint
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await fetchResource('GET', 'events');
        const todayMeetings = filterTodayMeetings(data);
        setMeetings(todayMeetings);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      }
    };
    fetchMeetings();

    // Auto-refresh the meeting list every minute
    const interval = setInterval(fetchMeetings, 60000);


    return () => clearInterval(interval);
  }, []);

  

  // Filter the meetings to show only today's meetings and exclude trainer-only events for general users
  const filterTodayMeetings = (meetings) => {
    const today = new Date();
    return meetings
      .filter((meeting) => {
        const meetingDate = new Date(meeting.date);
       
      
        return (
          meetingDate.getFullYear() === today.getFullYear() &&
          meetingDate.getMonth() === today.getMonth() &&
          meetingDate.getDate() === today.getDate()
        );
      })
      .filter((meeting) => !meeting.trainerOnly) // Exclude trainer-only meetings
      .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort meetings by time
  };

  // Mark a meeting as `completed` or `canceled`
  const updateMeetingStatus = async (meetingId, status) => {
    try {
      await fetchResource('PUT', `events/${meetingId}/status`, { body: { status } });
      setMeetings((prevMeetings) =>
        prevMeetings.map((meeting) =>
          meeting._id === meetingId ? { ...meeting, status } : meeting
        )
      );
    } catch (error) {
      console.error(`Error updating meeting status (${status}):`, error);
    }
  };

  // Automatically remove meetings at the end of the day
  useEffect(() => {
    const removeMeetings = () => {
      const now = new Date();
      setMeetings((prevMeetings) =>
        prevMeetings.filter((meeting) => {
          const meetingDate = new Date(meeting.date);
          return (
            meetingDate.getFullYear() === now.getFullYear() &&
            meetingDate.getMonth() === now.getMonth() &&
            meetingDate.getDate() === now.getDate()
          );
        })
      );
    };

    const interval = setInterval(removeMeetings, 60000);
    return () => clearInterval(interval);
  }, []);

  // Toggle the view of meetings (3 or all)
  const toggleShowAll = () => setShowAll((prevShowAll) => !prevShowAll);

  // Get current date in readable format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-GB', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Determine how many meetings to display
  const displayedMeetings = showAll ? meetings : meetings.slice(0, 3);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Upcoming Meetings</h2>
        <p className={styles.currentDate}>{getCurrentDate()}</p>
      </div>

      <div className={styles.meetingsList}>
        {displayedMeetings.length > 0 ? (
          displayedMeetings.map((meeting) => (
            
            <div key={meeting._id} className={styles.meetingItem}>
              <div className={styles.userInfo}>
              <img
                  src={
                    meeting.userId && meeting.userId.length > 0 && meeting.userId[0].image
                      ? meeting.userId[0].image
                      : person // Fallback to the placeholder image
                  }
                  alt={
                    meeting.userId && meeting.userId.length > 0
                      ? meeting.userId[0].name || 'User' // Fallback to 'User' if name is unavailable
                      : 'Unknown User' // Fallback alt text
                  }
                  className={styles.userImage}
                />

                <div className={styles.userDetails}>
                  <p className={styles.userName}>
                    {meeting.userId && meeting.userId.length > 0
                      ? meeting.userId.map((user) => user.name).join(', ')
                      : 'No User Assigned'}
                  </p>
                  <p className={styles.workoutType}>{meeting.eventType}</p>
                </div>
              </div>
              <div className={styles.meetingDetails}>
                <p className={styles.meetingTime}>
                  {new Date(meeting.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                <p className={styles.meetingDuration}>{meeting.duration} min Session</p>
              </div>
              {meeting.status === 'pending' ? (
                  <div className={styles.statusButtons}>
                    <button
                      className={styles.checkInButton}
                      onClick={() => updateMeetingStatus(meeting._id, 'completed')}
                    >
                      Check-In
                    </button>
                    <button
                      className={styles.noShowButton}
                      onClick={() => updateMeetingStatus(meeting._id, 'canceled')}
                    >
                      No-Show
                    </button>
                  </div>
                ) : (
                  <p className={styles.meetingStatus}>
                    {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                  </p>
                )}
            </div>
          ))
        ) : (
          <p>No meetings scheduled for today.</p>
        )}
      </div>

      {meetings.length > 3 && (
        <button className={styles.toggleButton} onClick={toggleShowAll}>
          {showAll ? 'See Less' : 'See All'}
        </button>
      )}
    </div>
  );
};

export default UpcomingMeetings;
