import React, { useState, useEffect } from 'react';
import fetchResource from '../../../api'; 
import { getSessionUser } from '../../../api/auth'; 

const UserNextEvents = () => {
  const [events, setEvents] = useState([]);
  const [unreadEvents, setUnreadEvents] = useState(0);

  // Fetch the authenticated user
  const user = getSessionUser()?.user; // Ensure user is properly retrieved

  useEffect(() => {
    if (!user || !user._id) {
      console.error("User is not defined or missing user ID");
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await fetchResource("GET", `events?userId=${user._id}`);
        
        if (response.authError) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        setEvents(response.events || []);
        setUnreadEvents(response.unreadCount || 0);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchEvents();
  }, [user]); // Ensure user is defined before making API calls

  return (
    <div>
      <h2>My Upcoming Events</h2>
      <p>You have {unreadEvents} new events</p>
      <ul>
        {events.map(event => (
          <li key={event._id}>{event.title} on {new Date(event.date).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserNextEvents;
