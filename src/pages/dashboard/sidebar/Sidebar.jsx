// Sidebar.jsx
import React from 'react';
import styles from './Sidebar.module.css'; 

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2 className={styles.title}>Trainer Dashboard</h2>
      <ul className={styles.navList}>
        <li className={styles.navItem}>
          <a href="/dashboard" className={styles.navLink}>Dashboard</a>
        </li>
        <li className={styles.navItem}>
          <a href="/clients" className={styles.navLink}>Clients</a>
        </li>
        <li className={styles.navItem}>
          <a href="/workouts" className={styles.navLink}>Workouts</a>
        </li>
        <li className={styles.navItem}>
          <a href="/schedules" className={styles.navLink}>Schedules</a>
        </li>
        <li className={styles.navItem}>
          <a href="/profile" className={styles.navLink}>Profile</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
