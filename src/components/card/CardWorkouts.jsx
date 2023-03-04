import styles from './card.module.css'


const CardWorkout = ({ item }) => {


     return(
          <div className={styles.product} style={{ backgroundImage: `url(${item.picture})` }} >
               <div className={styles.info}>
                    <h2>{item.type}</h2>
                   
               </div>
               
          </div>
     )
};

export default CardWorkout;