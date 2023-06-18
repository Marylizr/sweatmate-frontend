import React from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';


const CardDeleteFavs = ({ item }) => {

      
   
   const handleDelete = () => { 
         customFetch("DELETE", "fav/" + item._id)
      .then(res => {window.location.reload()})
      }
      console.log(item)
     return(
          <div className={styles.infoCard} >
               <img src={item.picture} alt=""/>
               <p>
                  Name: {item.name} <br />
                  # Series: {item.series} <br />
                  # Reps: {item.reps}<br />
                  Weight lifted: {item.weight} <br />
                  Date: {item.date}
               </p>
               
               <div>
                    <button onClick={() => handleDelete(item._id)}>DELETE </button>
               </div>
          </div>
     )
};

export default CardDeleteFavs;