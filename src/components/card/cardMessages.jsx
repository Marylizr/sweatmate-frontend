import React from 'react';
import styles from './cardM.module.css';
import customFetch from '../../api';
import pen from '../../assets/pen.svg';
import trash from '../../assets/trash.svg';

const CardMessages = ({ user, onClick }) => {
   const {name, email, image } = user;

   // const handleEdit = () => { 
   //    customFetch("PUT", "user/" + user._id)
   //  .then(window.location.reload())
   //  .catch(console.error('cannot delete this user'))
   // }

   const handleDelete = () => { 
      customFetch("DELETE", "user/" + user._id)
    .then(window.location.reload())
    .catch(console.error('cannot delete this user'))
   }

   return(
      <div className={styles.info} onClick={onClick}>
         <div className={styles.imagen}> 
            <img src={image}  alt=''/>
         </div>
         <div className={styles.data}>
            <p><b>name:</b> {name}</p>
            <p><b>email:</b> {email}</p>
         </div>
         <div className={styles.box}  >
            <button onClick={() => handleDelete(user._id)}>
               <img src={trash} alt='tras-icon'/>
            </button>
          
            <button>
               <img  src={pen} alt='edit-icon' />
            </button>
         </div>
      </div>   
    )
};

export default CardMessages;