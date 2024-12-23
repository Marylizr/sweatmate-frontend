import React from 'react';
import styles from './card.module.css';
import customFetch from '../../api';



const FollowCard = ({ item }) => {
   const handleEdit = () => { 
      customFetch("DELETE", "progress/" + item._id)
    .then( window.location.reload())
   }
   let newDate = new Date(item.date)
     const curretDate = newDate.toDateString();
    

   console.log(item.weight)
   return(
      <div className={styles.cardWrap}  >
          <div className={styles.follow}>
            <img src={item.picture} alt='user_img'/>
            <p>{item.name}</p>
            <p>Weight: {item.weight} Kg</p>
            <p>Waist: {item.waist} Cm</p>
            <p>Chest: {item.chest} Cm</p>
            <p>Body Fat: {item.bodyFat} %</p>
            <p>Hips: {item.hips} Cm</p>
            <p>Date: {curretDate}</p>
         </div>
            <button onClick={() => handleEdit(item._id)}>DELETE </button>
      </div>
    )
}

export default FollowCard