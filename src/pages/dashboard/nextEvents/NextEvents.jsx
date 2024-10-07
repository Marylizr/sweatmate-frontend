import React, { useState } from 'react';
import Modal from "./Modal/Modal";
import Form from './Form';
import styles from '../nextEvents/nextEvents.module.css'
import planner from '../../../assets/edit_calendar.svg'

const NextEvents = () => {
  // State to manage modal open/close
  const [isOpenModal, setIsOpenModal] = useState(false);

  // Function to open the modal
  const openModal = () => {
    setIsOpenModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsOpenModal(false);
  };

  return (
    <div className={styles.container}>
      <div onClick={openModal} className={styles.wrapper}>
        <img src={planner} alt='plan-icon'/>
        <h2>Plan the Next Events</h2>
    
      </div>

      {isOpenModal && (
        <Modal isOpen={isOpenModal} isClose={closeModal}>
          <Form />
        </Modal>
      )}
    </div>
  );
};

export default NextEvents;
