import React, { useState, useEffect } from 'react';
import styles from './calendar.module.css'; 
import fetchResource from '../../../api'; 
import calendar from '../../../assets/calendar_month.svg';

const Calendar = () => {
  const [currentMonth] = useState(new Date());
  const [trainerOnlyEvents, setTrainerOnlyEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // Track the selected day

  // Helper function to get the full month name
  const getMonthName = (date) => {
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Generate days for the calendar grid (current month)
  const generateCalendarDays = () => {
    const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    let days = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i));
    }
    return days;
  };

  // Fetch events from the API (trainer-only events from nextEvents)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetchResource('GET', 'events'); // Fetch events
        console.log("Fetched Events: ", response); // Debugging: Check fetched events
        const trainerEvents = response.filter(event => event.trainerOnly); // Filter by trainer-only
        setTrainerOnlyEvents(trainerEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, [currentMonth]);

  // Check if a specific day has a trainer-only event
  const hasEvent = (day) => {
    return trainerOnlyEvents.some(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Get events for the selected day
  const getEventsForDay = (day) => {
    return trainerOnlyEvents.filter(event => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day.getDate() &&
        eventDate.getMonth() === day.getMonth() &&
        eventDate.getFullYear() === day.getFullYear()
      );
    });
  };

  // Handle day click to show full day's events
  const handleDayClick = (day) => {
    const dayEvents = getEventsForDay(day);
    console.log("Events for selected day: ", dayEvents); // Debugging: Check selected day events
    setSelectedDay({ day, events: dayEvents });
  };

  // Handle closing the event details view
  const handleClose = () => {
    setSelectedDay(null); // Reset selectedDay to null to go back to the calendar view
  };

  // Render the full day's events when a day is clicked
  const renderDayEvents = () => {
    if (!selectedDay) {
      return <p>Select a day to see the events.</p>;
    }
    
    const { day, events: dayEvents } = selectedDay;

    if (dayEvents.length === 0) {
      return <p>No events for {day.toLocaleDateString()}</p>;
    }

    return (
      <>
        <div className={styles.dayEventsHeader}>
          <p className={styles.currentDate}>
            {day.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric' })}
          </p>
          <button className={styles.closeButton} onClick={handleClose}>X</button> {/* Close button */}
        </div>
        {dayEvents.map((event, index) => (
          <div key={index} className={styles.eventItem}>
            <p><b>{event.title}</b></p>
            <p><b>Type: </b>{event.eventType}</p>
            <p><b>Duration:</b> {event.duration} mins</p>
            <p><b>Location:</b> {event.location}</p>
            <p><b>Time: </b>{new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        ))}
      </>
    );
  };

  // Render the calendar grid with days
  const renderCalendarGrid = () => {
    const days = generateCalendarDays();
    return days.map((day, index) => (
      <div
        key={index}
        className={`${styles.calendarDay} ${hasEvent(day) ? styles.hasEvent : ''}`} // Highlight day if it has events
        onClick={() => handleDayClick(day)}
      >
        {day.getDate()}
      </div>
    ));
  };

  return (
    <div className={styles.container}>
      {/* Header with the current month */}
      <div className={styles.calendarHeader}>
        <img src={calendar} alt='calendar-icon'/>
        <h2>{getMonthName(currentMonth)}</h2>
      </div>

      {/* Calendar grid */}
      <div className={styles.calendarGrid}>
        {renderCalendarGrid()}
      </div>

      {/* Events display section */}
      <div className={styles.eventsSection}>
        {renderDayEvents()}
      </div>
    </div>
  );
};

export default Calendar;
