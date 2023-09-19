import React from 'react';
import styles from './healthyTips.module.css'

const HealthyTips = ({ item }) => {


  console.log(item.infotype)
  return (
    <div className={styles.cardWrap}>
      <div className={styles.style}>
        
          <h3>{item.infotype}</h3>
        
        <div className={styles.wrapper}>
          <p>{item.content}</p>
        </div>
      </div>
    </div>
  )
}

export default HealthyTips