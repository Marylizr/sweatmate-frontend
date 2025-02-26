import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../navBar/navbar.module.css';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../../api/auth";
import NavButton from '../../../components/navButton/navButton';
import logo from '../../../utils/logo_new.png';
import plus from '../../../assets/plus.svg';
import edit from '../../../assets/edit.svg';
import person from '../../../assets/person.svg';
import man from '../../../assets/man.svg';
import woman from '../../../assets/woman.svg';
import bot from '../../../assets/bot.svg';
import exit from '../../../assets/exit.svg';
import fit from '../../../assets/fit.svg';
import customFetch from '../../../api';

const NavBar = () => {
  const navigate = useNavigate();
  const [clicked, setClicked] = useState(false);
  const [user, setUser] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await customFetch('GET', 'user/me');
        setUser(response.name);
        setRole(response.role);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const onLogOut = () => {
    removeSession();
    navigate("/");
  };

  const handleClick = () => {
    setClicked(!clicked);
  };

  return (
    <nav className={styles.navbar}>
      {/* Burger Menu + Logo for small screens */}
      <div className={styles.burgerContainer}>
        <img src={logo} alt="logo" className={styles.logoSmall} />
        <NavButton clicked={clicked} handleClick={handleClick} />
      </div>

      {/* Menu Links */}
      <div className={`${styles.links} ${clicked ? styles.active : ''}`}>
        {/* Logo for larger screens */}
        <img src={logo} alt="logo" className={styles.logoLarge} />
        <h2>Hi, {user}!</h2>

        <div className={styles.side_menu}>
          <Link to='/main/dashboard' onClick={() => setClicked(false)}> Dashboard </Link>
        </div>
        <div className={styles.side_menu}>
          <img src={plus} alt='' />
          <Link to='/main/addworkout' onClick={() => setClicked(false)}> Add Workout </Link>
        </div>
        <div className={styles.side_menu}>
          <img src={edit} alt='' />
          <Link to='/main/workouts' onClick={() => setClicked(false)}> Edit Workout </Link>
        </div>
        <div className={styles.side_menu}>
          <img src={fit} alt='icon' />
          <Link to='/main/training' onClick={() => setClicked(false)}> Training </Link>
        </div>
        <div className={styles.side_menu}>
          {(role === 'admin' || role === 'personal-trainer') && (
            <>
              <Link to="/dashboard/female" onClick={() => setClicked(false)}>
                <img src={woman} alt='icon' />
              </Link>
              <Link to="/dashboard/male" onClick={() => setClicked(false)}>
                <img src={man} alt='icon' />
              </Link>
            </>
          )}
        </div>
        <div className={styles.side_menu}>
          {role === 'admin' && (
            <Link to="/main/admin-userProfiles" onClick={() => setClicked(false)}>
              <img src={person} alt='' /> Admin's Only
            </Link>
          )}
          {role === 'personal-trainer' && (
            <Link to="/main/userProfiles" onClick={() => setClicked(false)}>
              <img src={person} alt='' /> User Profiles
            </Link>
          )}
        </div>
        <div className={styles.side_menu}>
          <img src={bot} alt='icon' />
          <Link to='/main/openAi' onClick={() => setClicked(false)}> ChatBot </Link>
        </div>
        <div className={styles.side_menu}>
          <button onClick={() => { onLogOut(); setClicked(false); }}>
            <img className={styles.exit} src={exit} alt='icon' /> Log Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
