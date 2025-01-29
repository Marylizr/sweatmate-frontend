import React, { useState, useEffect } from 'react';
import Form from './Form';
import Modal from './Modal/Modal';
import customFetch from '../../../api';
import styles from './nextEvents.module.css';
import EventInfo from './EventInfo';

const PlanNextEvents = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Function to fetch events
  const getEvents = async () => {
    try {
      const json = await customFetch('GET', 'events');
      setEvents(json);
    } catch (err) {
      console.log(err, 'Cannot retrieve user information');
    }
  };

  // Fetch events on component mount
  useEffect(() => {
    getEvents();
  }, []);

  const closeModal = () => {
    setIsOpenModal(false);
    setSelectedEvent(null);
  };

  const WORKING_HOURS_START = 8; // 8:00 AM
  const WORKING_HOURS_END = 20; // 8:00 PM

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  // Check if a time is within working hours
  const isOutsideWorkingHours = (time) => {
    const [hours] = time.split(':');
    return parseInt(hours) < WORKING_HOURS_START || parseInt(hours) >= WORKING_HOURS_END;
  };

  const isSlotBlocked = (date, time) => {
    const [hours, minutes] = time.split(':');
    const slotDate = new Date(date);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    return events.some((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getTime() === slotDate.getTime();
    });
  };

  const handleSlotClick = (date, time) => {
    if (isOutsideWorkingHours(time)) {
      alert(`Time slot is outside working hours (${WORKING_HOURS_START}:00 to ${WORKING_HOURS_END}:00).`);
      return;
    }

    const [hours, minutes] = time.split(':');
    const slotDate = new Date(date);
    slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const selected = events.find((event) => {
      const eventDate = new Date(event.date);
      return eventDate.getTime() === slotDate.getTime();
    });

    if (selected) {
      setSelectedEvent(selected);
      setIsOpenModal(true);
    } else {
      alert('This time slot is available.');
    }
  };

  const generateWeekDays = () => {
    const week = [];
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      week.push(day);
    }

    return week;
  };

  return (
    <div className={styles.container2}>
      <h2>Next Events</h2>
      
      <Form refreshEvents={getEvents} />

      <div className={styles.timelineGrid}>
        {generateWeekDays().map((day) => (
          <div key={day} className={styles.dayColumn}>
            <div className={styles.header}>
              <h3>{day.toDateString()}</h3>
            </div>
            
            {times.map((time) => (
              <div
                key={time}
                className={`${styles.timeSlot} ${isSlotBlocked(day, time) ? styles.blocked : ''} ${isOutsideWorkingHours(time) ? styles.invalid : ''}`}
                onClick={() => handleSlotClick(day, time)}
              >
                {time}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isOpenModal && selectedEvent &&
       <Modal event={selectedEvent} onClose={closeModal} isOpen={isOpenModal} >
          <EventInfo event={selectedEvent}/>
       </Modal>
       }
    </div>
  );
};

export default PlanNextEvents;
