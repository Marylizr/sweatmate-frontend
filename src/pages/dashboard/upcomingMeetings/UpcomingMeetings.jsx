import React, { useState, useEffect } from 'react';
import fetchResource from '../../../api'; // Assume fetchResource is available for API calls
import styles from './upcomingmeetings.module.css'; // Custom CSS module
import person from '../../../assets/person_1.svg';

const UpcomingMeetings = ({ userId }) => {
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
    .filter(meeting => {
      const meetingDate = new Date(meeting.date);
      
      // Check if the meeting date matches exactly today's year, month, and day
      return (
        meetingDate.getFullYear() === today.getFullYear() &&
        meetingDate.getMonth() === today.getMonth() &&
        meetingDate.getDate() === today.getDate()
      );
    })
    .filter(meeting => {
      // Ensure the meeting has not already ended
      const meetingEndTime = new Date(meeting.date).getTime() + meeting.duration * 60000;
      return Date.now() < meetingEndTime;
    });
};


  // Toggle the view of meetings (3 or all)
  const toggleShowAll = () => {
    setShowAll((prevShowAll) => !prevShowAll);
  };

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
          displayedMeetings.map((meeting, index) => (
            <div key={index} className={styles.meetingItem}>
              <div className={styles.userInfo}>
                <img
                  src={meeting.user ? meeting.user.image : person} 
                  alt={`${meeting.userId?.name || 'User'}'s profile`}
                  className={styles.userImage}
                />
                <div className={styles.userDetails}>
                  <p className={styles.userName}>
                    {meeting.userId?.name || 'Unknown User'}
                    {meeting.userId === 'all' && <span className={styles.allUsersLabel}> (All Users)</span>}
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
