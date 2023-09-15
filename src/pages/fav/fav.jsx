import React, {useEffect, useState, useContext } from 'react'
import customFetch from '../../api';
// import Card from '../../components/card/Card';
import NavBar from '../../components/navBar/navBar';
import styles from '../quadriceps/quadriceps.module.css';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';
import { UserContext } from '../../components/userContext/userContext';
import CardDeleteFavs from '../../components/card/CardDeleteFavs';


const SavedWorkouts = () => {
  const [saved, setSaved] = useState([]);
  const { name, setName  } = useContext(UserContext);
  


  useEffect(() => {
    customFetch("GET", "user/me")
    .then((json) => {
    setName(json.name);
    })
  }, [name, setName]);


  useEffect(() => {
    customFetch("GET", "fav")
      .then((json) => {
      setSaved(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setSaved]);

 

  console.log(saved)

  return (
    <div className={styles.container} >
      <NavBar />
      <div className={styles.small_header}> 
        <Link to='/profile'> <img src={arrow_left} alt='' /></Link>
        <h2>{name}, Welcome to your WorkOut</h2>
      </div>
      <div className={styles.wrap}>
        {
          saved && saved.length > 0 && saved.filter( item => item.userName === `${name}`).map( item => 
            <CardDeleteFavs  item={item} id={item._id} key={item._id}
             />)
        }
      </div>
       
    </div>
    
  )
}

export default SavedWorkouts;

