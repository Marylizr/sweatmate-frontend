import React from 'react';
import styles from './cardM.module.css';
import customFetch from '../../api';


const CardMessages = ({ item }) => {

   const handleEdit = () => { 
      customFetch("DELETE", "contact/" + item._id)
    .then(res => {window.location.reload();})
   }

   return(
      <div className={styles.box}  >
          <div className={styles.info}>
            <p>From: {item.name}</p>
            <p>email: {item.email}</p>
            <p>Message: {item.message}</p>
         </div>
            <button onClick={() => handleEdit(item._id)}>DELETE </button>
      </div>
    )
};

export default CardMessages;