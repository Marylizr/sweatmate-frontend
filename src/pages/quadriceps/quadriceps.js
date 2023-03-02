import React, {useEffect, useState } from 'react'
import customFetch from '../../api';
import Card from '../../components/card/Card';
import NavBar from '../../components/navBar/navBar';
import styles from '../abs/abs.module.css';



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
    <div>
      <NavBar />
      <h1>Welcome to Quadriceps workout</h1>
    <div className={styles.container}>
    {
      filteredData && filteredData.length > 0 && filteredData.filter(item => item.type.includes('quadriceps')).map( item => 
        <Card addToFav={addToFav} item={item} id={item._id} key={item._id}
        onClick={() => {onClick()}} />)}
    </div>
      
       
    </div>
    
  )
}

export default Quadriceps;