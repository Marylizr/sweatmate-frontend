import React, { useEffect, useState } from "react";
import fetchResource from "../../api"; 
import styles from "./userNextEvents.module.css";

const UserNextEvents = () => {
  const [events, setEvents] = useState([]);
  const [unreadEvents, setUnreadEvents] = useState(0);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchResource("GET", "events/user");
        if (response.authError) {
          alert("Session expired. Please log in again.");
          window.location.href = "/login";
          return;
        }

        setEvents(response.events);
        setUnreadEvents(response.unreadCount);
      } catch (error) {
        console.error("Error fetching user events:", error);
      }
    };

    fetchEvents();
  }, []);

  const handleConfirm = async (eventId) => {
    try {
      await fetchResource("PUT", `events/confirm/${eventId}`);
      setEvents(events.map(event => event._id === eventId ? { ...event, confirmed: true } : event));
    } catch (error) {
      console.error("Error confirming event:", error);
    }
  };

  const handleCancel = async (eventId) => {
    try {
      await fetchResource("PUT", `events/cancel/${eventId}`);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error("Error canceling event:", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>My Next Events</h2>
        {unreadEvents > 0 && <span className={styles.badge}>{unreadEvents}</span>}
      </header>

      {events.length === 0 ? (
        <p className={styles.noEvents}>No upcoming events.</p>
      ) : (
        <ul className={styles.eventList}>
          {events.map(event => (
            <li key={event._id} className={styles.eventItem}>
              <h3>{event.title}</h3>
              <p>{new Date(event.date).toLocaleString()}</p>
              <p>{event.location}</p>
              <div className={styles.buttons}>
                {!event.confirmed ? (
                  <>
                    <button className={styles.confirm} onClick={() => handleConfirm(event._id)}>Confirm</button>
                    <button className={styles.cancel} onClick={() => handleCancel(event._id)}>Cancel</button>
                  </>
                ) : (
                  <span className={styles.confirmed}>Confirmed</span>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserNextEvents;
