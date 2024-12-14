import React from 'react';
import styles from '../nextEvents/nextEvents.module.css'
import planner from '../../../assets/edit_calendar.svg'
import { Link } from 'react-router-dom';

const NextEvents = () => {
 

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <img src={planner} alt='plan-icon'/>
        
        <Link to='/main/plannextevents'><h2>Plan the Next Events</h2></Link>
      </div>

  
    </div>
  );
};

export default NextEvents;
