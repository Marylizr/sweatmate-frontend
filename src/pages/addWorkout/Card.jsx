import React from 'react'
import pic from "../../assets/image.svg";
import styles from '../addWorkout/addworkout.module.css';


const Card = ({ item }) => {

     return(
        <div>
          
          <div className={styles.profile}>
            <h3>Created Workout</h3>
                <div className={styles.box}>
                    <img src={item.image ? item.image : pic} alt="workout_Image" />
                         <div className={styles.elements}>
                         <p>workout name: {item.name}</p>
                         <p>workout type: {item.type}</p>
                         <p>workout description: {item.description}</p>
                    </div> 
               </div>
          </div>

        </div>
     )
};


export default Card;