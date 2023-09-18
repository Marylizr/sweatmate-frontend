import React from 'react';
import styles from './healthyTips.module.css'

const HealthyTips = ({item}) => {
  return (
    <div className={styles.container}>
      <div>
         <h3>{item.infoType}</h3>
      </div>
      <div className={styles.wrapper}>
        <p>{item.content}</p>
      </div>
    </div>
  )
}

export default HealthyTips