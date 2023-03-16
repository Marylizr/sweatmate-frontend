import React from 'react';
import styles from '../card/card.module.css';
import customFetch from '../../api';


const CardDeleteFavs = ({ item }) => {

      
   
   const handleDelete = () => { 
         customFetch("DELETE", "saveworkout/" + item._id)
      .then(res => {window.location.reload();})
      }
      console.log(item)
     return(
          <div className={styles.info} >
               <img src={item.picture} alt=""/>
               <p>
                  Type: {item.type} <br />
                  Name: {item.name} <br />
                  Description: {item.description} <br />
                  # Series: {item.series} <br />
                  # Reps: {item.reps}<br />
                  Weigt lifted: {item.weight}
               </p>
               
               <div>
                    <button onClick={() => 
                     handleDelete(item._id)}>DELETE </button>
               </div>
          </div>
     )
};

export default CardDeleteFavs;