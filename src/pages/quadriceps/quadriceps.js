import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import Card from '../../components/card/Card';
import NavBar from '../../components/navBar/navBar';
import styles from '../quadriceps/quadriceps.module.css';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';


const Quadriceps = ({isInFav='false', onClick}) => {
 const [filteredData, setFilteredData] = useState([])
  const [favs, setFavs] = useState([]);
  const [data, setData] = useState([]);
 

  useEffect(() => {
    if (data.length) {
      setFilteredData(data);
    }
  }, [data, setFilteredData]);


  useEffect(() => {
    customFetch("GET", "workouts")
      .then((json) => {
      setData(json);
      })
      .catch((error) => {
        console.log(error);
      })
  }, [setFilteredData]);

    const addToFav = (item) => {       
      setFavs([...favs, item]);
  }

console.log(filteredData)
  return (
    <div className={styles.container} >
      <NavBar />
      <div className={styles.small_header}> 
        <Link to='/dashboard'> <img src={arrow_left} alt='' /></Link>
        <h2>Welcome to Quadriceps workout</h2>
      </div>
      <div className={styles.wrap}>
        {
          filteredData && filteredData.length > 0 && filteredData.filter(item => item.type === 'quadriceps').map( item => 
            <Card addToFav={addToFav} item={item} id={item._id} key={item._id}
            onClick={() => {onClick()}} />)
        }
      </div>
      
       
    </div>
    
  )
}

export default Quadriceps;