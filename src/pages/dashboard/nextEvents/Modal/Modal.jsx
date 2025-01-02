import React from 'react';
import styles from './modal.css';
import fetchResource from '../../../../api';
import { useNavigate } from 'react-router-dom';

const Modal = ({ event, onClose }) => {
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      await fetchResource('PUT', `events/${event._id}/confirm`);
      alert('Event confirmed and email sent!');
      onClose();
    } catch (error) {
      console.error('Error confirming event:', error);
    }
  };

  const handleReschedule = () => {
    // Navigate to the form with the current event's ID for rescheduling
    navigate(`/main/reschedule/${event._id}`);
  };

  const handleCancel = async () => {
    console.log(`Attempting to cancel event with ID: ${event._id}`);
    try {
      await fetchResource('DELETE', `events/${event._id}`);
      alert('Event canceled successfully!');
      onClose();
    } catch (error) {
      console.error('Error canceling event:', error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>{new Date(event.date).toDateString()}</h2>
        <p>
          <strong>Time:</strong>{' '}
          {new Date(event.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
        <p>
          <strong>Title:</strong> {event.title}
        </p>
        <p>
          <strong>Participants:</strong>
        </p>
        {event.userId && event.userId.length > 0 ? (
          <ul>
            {event.userId.map((user) => (
              <li key={user._id}>
                {user.name} ({user.email || 'No email available'})
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants assigned.</p>
        )}

        <div className={styles.buttons}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm
          </button>
          <button className={styles.rescheduleButton} onClick={handleReschedule}>
            Re-schedule
          </button>
          <button className={styles.cancelButton} onClick={handleCancel}>
            Cancel
          </button>
        </div>

        <button className={styles.closeButton} onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
