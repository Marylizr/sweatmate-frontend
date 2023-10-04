import React from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';


const CardDeleteFavs = ({ item }) => {

     const { picture, name, series, reps, lifted } = item
     let newDate = new Date(item.date)
     const curretDate = newDate.toDateString()
        
      
   const handleDelete = () => { 
         customFetch("DELETE", "fav/" + item._id)
      .then(window.location.reload())
      }

      console.log(item)
     
     return(
          <div className={styles.infoCard} >
               <img src={picture} alt=""/>
               <p className={styles.left}>
               
                    name: {name} <br />
                  # Series: {series} <br />
                  # Reps: {reps}<br />
                  Weight lifted:{lifted} <br />
                  Date: {curretDate}
               </p>
               
               <div>
                    <button onClick={() => handleDelete(item._id)}>Delete </button>
               </div>
          </div>
     )
};

export default CardDeleteFavs;