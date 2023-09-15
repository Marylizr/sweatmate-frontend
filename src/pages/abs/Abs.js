import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
// import { UserContext } from '../../components/userContext/userContext';
import Card from '../../components/card/Card';
import NavBar from '../../components/navBar/navBar';
import styles from '../abs/abs.module.css';
import { Link } from 'react-router-dom';
import arrow_left from '../../utils/arrow_left.svg';


const Abs = ({isInFav='false', onClick}) => {
 const [filteredData, setFilteredData] = useState([])
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



console.log(filteredData)
  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.small_header}> 
        <Link to='/dashboard'> <img src={arrow_left} alt='' /></Link>
        <h2>Welcome to Abs workout</h2>
      </div>
    <div className={styles.wrap}>
    {
      filteredData && filteredData.length > 0 && filteredData.filter(item => item.type === 'abs' ).map( item => 
        <Card item={item} id={item._id} key={item._id}
        onClick={() => {onClick()}} />)
    }
    </div>
      
       
    </div>
    
  )
}

export default Abs