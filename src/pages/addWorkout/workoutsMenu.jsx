import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import styles from '../addWorkout/addworkout.module.css';
import customFetch from '../../api';

const WorkoutsMenu = () => {

  const [user, setUser] = useState();
  const [pic, setPic] = useState();
 

  const getUser = () => {
    customFetch("GET", "user/me")
    .then((json) => { 
       setUser(json.name);  
       setPic(json.image)
       }); }
  
    useEffect(() => {
    getUser() 
  },[]);

console.log(user)

  return (
    <div className={styles.menu}>
      <img src={pic} alt=''/>
      <p>Hello {user}</p>
      <div className={styles.side_menu}>
        <Link to='/workouts'> Edit Workout </Link> <br />
      </div>
      <div className={styles.side_menu}>
        <Link to='/addworkout'> Add Workout </Link>
      </div>
      <div className={styles.side_menu}>
        <Link to='/messages'> InBox </Link>
      </div>
      <div className={styles.side_menu}>
        <Link to='/dashboard'> Dashboard </Link>
      </div>
    </div>
  )
}

export default WorkoutsMenu;