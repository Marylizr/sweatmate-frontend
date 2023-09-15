import React from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';


const DeleteCart = ({ item, onClick }) => {

   const handleDelete = () => { 
         customFetch("DELETE", "workouts/" + item._id)
       .then(window.location.reload(true))
      }
      
     return(
          <div className={styles.info}>
               <h4>{item.type}</h4>
               <img src={item.picture} alt=""/>
               <div>
                    <button onClick={() => 
                     handleDelete(item._id)}>DELETE </button>
                     <button onClick={onClick}>EDIT</button>
               </div>
          </div>
     )
};

export default DeleteCart;