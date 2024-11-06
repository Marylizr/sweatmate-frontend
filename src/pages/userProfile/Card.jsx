import React from 'react';
import styles from './cardM.module.css';
// import customFetch from '../../api';
import pen from '../../assets/pen.svg';
import trash from '../../assets/trash.svg';
import persona from '../../assets/person_1.svg';

const Card = ({ user, onEdit, onDelete }) => {
  const { name, email, image } = user;

  return (
    <div className={styles.info}>
      <div className={styles.imagen}>
        <img src={image || persona} alt="userImage" />
      </div>
      <div className={styles.data}>
        <p><b>Name:</b> {name}</p>
        <p><b>Email:</b> {email}</p>
      </div>
      <div className={styles.box}>
        <button onClick={onDelete}>
          <img src={trash} alt="trash-icon" />
        </button>
        <button onClick={onEdit}>
          <img src={pen} alt="edit-icon" />
        </button>
      </div>
    </div>
  );
};

export default Card;
