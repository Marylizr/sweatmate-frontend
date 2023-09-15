import React from 'react';
import styles from './cardM.module.css';
import customFetch from '../../api';



const CardMessages = ({ user, onClick }) => {
   const {name, email, age, weight, height, goal, image } = user;

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
      <div className={styles.info}>
         <div className={styles.imagen}> 
            <img src={image}  alt=''/>
         </div>
            <p><b>name:</b> {name}</p>
            <p><b>email:</b> {email}</p>
            <p><b>age:</b> {age} years old</p>
            <p><b>weight:</b> {weight} Kg</p>
            <p><b>height:</b> {height} Cm</p>
            <p><b>goal:</b> {goal} </p>
         <div className={styles.box}  >
            <button onClick={() => handleDelete(user._id)}>DELETE </button>
            <button onClick={onClick}>EDIT</button>
         </div>
      </div>
            
    )
};

export default CardMessages;