import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../../api/auth";
import customFetch from '../../../api';
import styles from '../navBar/navbar.module.css';
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

const WorkoutsMenu = () => {
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
    <div className={styles.menu}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="SweatMate Logo" />
      </div>

      <nav className={`${styles.sideMenu} ${clicked ? styles.active : ''}`}>
        <h2>Hi, {user}!</h2>

        <div className={styles.navLinks}>
          <Link to='/main/dashboard'> Dashboard </Link>
          <Link to='/main/addworkout'>
            <img src={plus} alt="Add Workout" /> Add Workout
          </Link>
          <Link to='/main/workouts'>
            <img src={edit} alt="Edit Workout" /> Edit Workout
          </Link>
          <Link to='/main/training'>
            <img src={fit} alt="Training" /> Training
          </Link>
          {(role === 'admin' || role === 'personal-trainer') && (
            <div className={styles.trainerLinks}>
              <Link to="/dashboard/female">
                <img src={woman} alt="Female Dashboard" />
              </Link>
              <Link to="/dashboard/male">
                <img src={man} alt="Male Dashboard" />
              </Link>
            </div>
          )}
          {role === 'admin' && (
            <Link to="/main/admin-userProfiles">
              <img src={person} alt="Admin Profiles" /> Admin's Only
            </Link>
          )}
          {role === 'personal-trainer' && (
            <Link to="/main/userProfiles">
              <img src={person} alt="User Profiles" /> User Profiles
            </Link>
          )}
          <Link to='/main/openAi'>
            <img src={bot} alt="ChatBot" /> ChatBot
          </Link>
          <button onClick={onLogOut}>
            <img className={styles.exit} src={exit} alt="Log Out" /> Log Out
          </button>
        </div>
      </nav>

      <div className={styles.burger}>
        <NavButton clicked={clicked} handleClick={handleClick} />
      </div>
    </div>
  );
};

export default WorkoutsMenu;
