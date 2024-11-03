import React from 'react';
import styles from './cardM.module.css';
import customFetch from '../../api';
import pen from '../../assets/pen.svg';
import trash from '../../assets/trash.svg';
import persona from '../../assets/person_1.svg';

const CardMessages = ({ user, onEdit, onDelete }) => {
   const { name, email, image,  } = user;

   const handleEdit = () => {
      onEdit(user);
   };

   const handleDelete = () => {
      if (window.confirm('Are you sure you want to delete this user?')) {
         customFetch("DELETE", `user/${user._id}`)
            .then(() => onDelete(user._id))
            .catch(error => console.error('Error deleting user:', error));
      }
   };

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
            <button onClick={handleDelete}>
               <img src={trash} alt='trash-icon' />
            </button>
            <button onClick={handleEdit}>
               <img src={pen} alt='edit-icon' />
            </button>
         </div>
      </div>
   );
};

export default CardMessages;
