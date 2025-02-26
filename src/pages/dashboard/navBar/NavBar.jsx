import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../navBar/navbar.module.css';
import { useNavigate } from "react-router-dom";
import { removeSession } from "../../../api/auth";
import styled from 'styled-components';
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
        console.log(response);
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
      <NavContainer>
        {/* Burger Menu with Logo */}
        <div className='burger'>
          <img src={logo} alt='logo' className={styles.logo} />
          <NavButton clicked={clicked} handleClick={handleClick} />
        </div>

        {/* Navigation Links */}
        <div className={`links ${clicked ? 'active' : ''}`}>
          <h2>Hi, {user}!</h2>

          <div className={styles.side_menu}>
            <Link to='/main/dashboard' onClick={() => setClicked(false)}> Dashboard </Link>
          </div>
          <div className={styles.side_menu}>
            <img src={plus} alt=''/>
            <Link to='/main/addworkout' onClick={() => setClicked(false)}> Add Workout </Link>
          </div>
          <div className={styles.side_menu}>
            <img src={edit} alt=''/>
            <Link to='/main/workouts' onClick={() => setClicked(false)}> Edit Workout </Link>
          </div>
          <div className={styles.side_menu}>
            <img src={fit} alt='icon'/>
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
                <img src={person} alt=''/> Admin's Only 
              </Link>
            )}
            {role === 'personal-trainer' && (
              <Link to="/main/userProfiles" onClick={() => setClicked(false)}>
                <img src={person} alt=''/> User Profiles 
              </Link>
            )}
          </div>
          <div className={styles.side_menu}>
            <img src={bot} alt='icon'/>
            <Link to='/main/openAi' onClick={() => setClicked(false)}> ChatBot </Link>
          </div>
          <div className={styles.side_menu}>
            <button onClick={() => {onLogOut(); setClicked(false); }}>
              <img className={styles.exit} src={exit} alt='icon'/> Log Out 
            </button>
          </div>
        </div>
      </NavContainer>
    </div>
  );
};

const NavContainer = styled.nav`
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  z-index: 100;

  .links {
    position: absolute;
    top: -700px;
    left: -2000px;
    right: 0;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    transition: all .5s ease;
    z-index:100;
    padding-bottom: 2em;

    a {
      color: grey;
      display: block;
      margin-right:1em;
      font-size: 1.5em;
      text-decoration: none;
    }

    a:hover {
      color:teal;
      font-size:20px;
      font-weight:bold;
    }

    img {
      width:10em;
    }
  }

  .links.active {
    width: 90vw;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    top: 5em;
    left: 0;
    right: 0;
    text-align: center;
    background: #f7f7f7;
    z-index: 100;
    flex-direction: column;
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    box-shadow: 0px 0px 8px #80808042;
  }

  .burger {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .logo {
    width: 50px;
    height: auto;
  }

  @media (max-width: 768px) {
    .burger {
      position: absolute;
      left: 10px;
      top: 15px;
    }

    .logo {
      width: 40px;
    }
  }
`;

export default NavBar;
