import styles from '../card/card.module.css'
import React from 'react'


const Card = ({ item }) => {

     return(
        <div className={styles.container} > 
          <div className={styles.info}>
               <video controls src={item.video} alt='workout'/>
               <div className={styles.descrip}>
                    <p className={styles.bold}>name:</p><p>{item.name}</p>
                    <p className={styles.bold}>description:</p><p>{item.description}</p>
               </div> 
          </div>
          </div>
     )
};

export default Card;