import React from 'react';
import styles from './ptinfo.module.css';

const PtInfo = () => {
  return (
    <div className={styles.container}>
      <div>Personal Trainer Info</div>
      <div>
         <div className={styles.photo}>
            <img src='' alt='pt' />
         </div>
         <div className={styles.name}>Hi! name</div>
            
      </div>
    </div>
  )
}

export default PtInfo