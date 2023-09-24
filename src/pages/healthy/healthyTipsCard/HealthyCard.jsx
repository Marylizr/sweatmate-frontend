import React from 'react';
import styles from './healthyCard.module.css'

const HealthyTips = ({ item }) => {


  console.log(item.infotype)
  return (
    <div className={styles.cardWrap}>
      <div className={styles.style}>
        
          <h3>{item.infotype}</h3>
        
        <div className={styles.wrapper}>
          <img src={item.picture} alt="card_img"/>
          <p>{item.content}</p>
        </div>
      </div>
    </div>
  )
}

export default HealthyTips