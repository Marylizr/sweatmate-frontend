import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styles from './PoliciesMenu.module.css';

const PoliciesMenu = () => {
  const location = useLocation(); // Get the current route

  // Map URLs to display subtitles correctly
  const subtitleMap = {
    '/terms': 'Terms',
    '/privacy': 'Privacy Policy',
    '/acceptable-use': 'Acceptable Use Policy',
  };

  return (
    <div className={styles.container}>
     
      <h1 className={styles.subtitle}>{subtitleMap[location.pathname] || 'Policies'}</h1>
      <nav className={styles.nav}>
        <NavLink to="/terms" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>Terms</NavLink>
        <NavLink to="/privacy-policy" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>Privacy</NavLink>
        <NavLink to="/acceptable-use" className={({ isActive }) => isActive ? `${styles.menuItem} ${styles.active}` : styles.menuItem}>Acceptable use</NavLink>
      </nav>
    </div>
  );
};

export default PoliciesMenu;
