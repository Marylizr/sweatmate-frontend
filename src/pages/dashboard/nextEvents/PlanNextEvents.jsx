import React, { useState, useEffect } from 'react';
import Form from './Form';
import Modal from './Modal/Modal';
import customFetch from '../../../api';
import styles from './nextEvents.module.css';

const PlanNextEvents = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const json = await customFetch('GET', 'events');
        setEvents(json);
      } catch (err) {
        console.log(err, 'Cannot retrieve user information');
      }
    };

    getEvents();
  }, []);

   const closeModal = () => {
      setIsOpenModal(false);
      setSelectedEvent(null);
   };

  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'];

  const handleSlotClick = (date, time) => {
   const [hours, minutes] = time.split(':');
   const slotDate = new Date(date);
   slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
 
   const selected = events.find((event) => {
     const eventDate = new Date(event.date);
     return eventDate.getTime() === slotDate.getTime();
   });
 
   console.log('Selected Event:', selected); // Debugging line
 
   if (selected) {
     setSelectedEvent(selected);
     setIsOpenModal(true);
   }
 };
 

  const isSlotBlocked = (date, time) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      const slotDate = new Date(date);
      const [hours, minutes] = time.split(':');

      slotDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      return eventDate.getTime() === slotDate.getTime();
    });
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
      
      <Form />

      <div className={styles.timelineGrid}>
        {generateWeekDays().map((day) => (
          <div key={day} className={styles.dayColumn}>
            <h3>{day.toDateString()}</h3>
            {times.map((time) => (
              <div
                key={time}
                className={`${styles.timeSlot} ${isSlotBlocked(day, time) ? styles.blocked : ''}`}
                onClick={() => isSlotBlocked(day, time) && handleSlotClick(day, time)}
              >
                {time}
              </div>
            ))}
          </div>
        ))}
      </div>

      {isOpenModal && selectedEvent && <Modal event={selectedEvent} onClose={closeModal} />}
    </div>
  );
};

export default PlanNextEvents;
